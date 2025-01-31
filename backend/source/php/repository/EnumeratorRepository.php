<?php

namespace mate\repository;

use mate\abstract\clazz\Repository;
use mate\abstract\trait\SelectByName;
use mate\error\WPErrorBuilder;
use mate\model\EnumeratorModel;
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
        $this->db->transaction();
        $q = <<<SQL
        INSERT INTO {$this->table} (
            `name`,
            `description`,
            `typeId`
        )
        VALUES (
            :name,
            :description,
            :typeId
        )
        SQL;

        try {
            $s = $this->db->prepare($q);
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
            return $this->selectById($model->id, false);
        } catch (Throwable $err) {
            $this->db->rollback();
            return WPErrorBuilder::internalServerError($err->getMessage(), $err->getTraceAsString());
        }
    }

    public function update($model): ?object
    {
        $this->db->transaction();
        $previousModel = $this->selectById($model->id);
        $updateType = $previousModel->typeId !== $model->typeId;

        $q = <<<SQL
        UPDATE {$this->table}
        SET
        `name` = :name,
        `description` = :description,
        `typeId` = :typeId
        WHERE `id` = :id
        SQL;

        $newValueIdList = array_map(fn($nv) => $nv->id, $model->valueList);
        $previousValueIdList = array_map(fn($ov) => $ov->id, $previousModel->valueList);

        try {
            $s = $this->db->prepare($q);
            $s->bindValue(":name", $model->name, PDO::PARAM_STR);
            $s->bindValue(":description", $model->description, PDO::PARAM_STR);
            $s->bindValue(":typeId", $model->typeId, PDO::PARAM_INT);
            $s->bindValue(":id", $model->id, PDO::PARAM_INT);
            $s->execute();

            if ($updateType) {
                $this->valueRepository->deleteByEnumeratorId($model->id);
            }

            foreach ($model->valueList as $value) {
                $value->enumeratorId = $model->id;
                if ($value->id !== null) {
                    if ($updateType === false) {
                        $this->valueRepository->update($value);
                    }
                } else {
                    $this->valueRepository->insert($value);
                }
            }

            if ($updateType === false) {
                array_map(
                    [$this->valueRepository, "deleteById"],
                    array_filter($previousValueIdList, fn($id) => !in_array($id, $newValueIdList))
                );
            }

            $this->db->commit();
            return $this->selectById($model->id, false);
        } catch (Throwable $err) {
            $this->db->rollback();

            return WPErrorBuilder::internalServerError($err->getMessage(), $err->getTraceAsString());
        }
    }

    public function selectById(int $id, bool $cache = true): ?object
    {
        $m = parent::selectById($id, $cache);

        if ($m !== null) {
            $m->valueList = $this->valueRepository->selectByEnumeratorId($m->id);
        }

        return $m;
    }
}
