<?php

namespace mate\repository;

use mate\abstract\clazz\Repository;
use mate\abstract\trait\SelectByName;
use mate\error\WPErrorBuilder;
use mate\model\EnumeratorModel;
use mate\SQL;
use PDO;
use Throwable;

class EnumeratorRepository extends Repository
{
    use SelectByName;

    protected string $table = "mate_enumerator";
    protected string $model = EnumeratorModel::class;

    private readonly EnumeratorValueRepository $valueRepository;

    public function __construct()
    {
        parent::__construct();
        $this->valueRepository = EnumeratorValueRepository::inject();
    }

    public function insert($model): ?object
    {
        $result = null;

        try {
            $this->db->transaction();
            $s = $this->db->prepare(SQL::ENUMERATOR_INSERT);
            $s->bindValue(":name", $model->name, PDO::PARAM_STR);
            $s->bindValue(":description", $model->description, PDO::PARAM_STR);
            $s->bindValue(":typeId", $model->typeId, PDO::PARAM_INT);
            $s->execute();
            $model->id = $this->db->lastInsertId();

            foreach ($model->valueList as $value) {
                $value->enumeratorId = $model->id;
                $this->valueRepository->insert($value);
            }

            $this->db->commit();
            $result = $this->selectById($model->id, false);
        } catch (Throwable $err) {
            $this->db->rollback();
            $result = WPErrorBuilder::internalServerError($err->getMessage(), $err->getTraceAsString());
        }

        return $result;
    }

    public function update($model): ?object
    {
        $result = null;
        $previousModel = $this->selectById($model->id);
        $hasNewType = $previousModel->typeId !== $model->typeId;
        $newValueIdList = array_map(fn($nv) => $nv->id, $model->valueList);
        $previousValueIdList = array_map(fn($ov) => $ov->id, $previousModel->valueList);
        $toDeleteIdList = array_filter($previousValueIdList, fn($id) => !in_array($id, $newValueIdList));

        try {
            $this->db->transaction();
            $s = $this->db->prepare(SQL::ENUMERATOR_UPDATE);
            $s->bindValue(":name", $model->name, PDO::PARAM_STR);
            $s->bindValue(":description", $model->description, PDO::PARAM_STR);
            $s->bindValue(":typeId", $model->typeId, PDO::PARAM_INT);
            $s->bindValue(":id", $model->id, PDO::PARAM_INT);
            $s->execute();

            if ($hasNewType) {
                $this->valueRepository->deleteByEnumeratorId($model->id);
            } else {
                array_map([$this->valueRepository, "deleteById"], $toDeleteIdList);
            }

            foreach ($model->valueList as $value) {
                $value->enumeratorId = $model->id;
                if ($value->id !== null) {
                    if ($hasNewType === false) {
                        $this->valueRepository->update($value);
                    }
                } else {
                    $this->valueRepository->insert($value);
                }
            }

            $this->db->commit();
            $result = $this->selectById($model->id, false);
        } catch (Throwable $err) {
            $this->db->rollback();

            $result = WPErrorBuilder::internalServerError($err->getMessage(), $err->getTraceAsString());
        }

        return $result;
    }

    public function selectById(int $id, bool $cache = true): ?object
    {
        $m = parent::selectById($id, $cache);

        if ($m !== null) {
            $m->valueList = $this->valueRepository->selectByEnumeratorId($m->id);
        }

        return $m;
    }

    public function containsValueById(int $id, int $valueId): bool
    {
        $model = $this->selectById($id);

        return $model !== null
            ? count(array_filter($model->valueList, fn($v) => $v->id === $valueId)) > 0
            : false;
    }
}
