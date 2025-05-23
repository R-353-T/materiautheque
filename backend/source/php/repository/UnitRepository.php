<?php

namespace mate\repository;

use mate\abstract\clazz\Repository;
use mate\abstract\trait\SelectByName;
use mate\error\WPErrorBuilder;
use mate\model\UnitModel;
use mate\SQL;
use PDO;
use Throwable;
use WP_Error;

class UnitRepository extends Repository
{
    use SelectByName;

    protected string $table = "mate_unit";
    protected string $model = UnitModel::class;

    private readonly UnitValueRepository $valueRepository;
    private readonly FieldRepository $fieldRepository;
    private readonly FormValueRepository $formValueRepository;

    public function __construct()
    {
        parent::__construct();
        $this->valueRepository = UnitValueRepository::inject();
        $this->fieldRepository = FieldRepository::inject();
        $this->formValueRepository = FormValueRepository::inject();
    }

    public function insert($model): ?object
    {
        $result = null;

        try {
            $this->db->transaction();
            $s = $this->db->prepare(SQL::UNIT_INSERT);
            $s->bindValue(":name", $model->name, PDO::PARAM_STR);
            $s->bindValue(":description", $model->description, PDO::PARAM_STR);
            $s->execute();
            $model->id = $this->db->lastInsertId();

            foreach ($model->valueList as $value) {
                $value->unitId = $model->id;
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
        $getId = fn($v) => $v->id;
        $newValueIdList = array_map($getId, $model->valueList);
        $previousValueIdList = array_map($getId, $previousModel->valueList);
        $toDeleteIdList = array_filter($previousValueIdList, fn ($id) => !in_array($id, $newValueIdList));

        try {
            $this->db->transaction();
            $s = $this->db->prepare(SQL::UNIT_UPDATE);
            $s->bindValue(":name", $model->name, PDO::PARAM_STR);
            $s->bindValue(":description", $model->description, PDO::PARAM_STR);
            $s->bindValue(":id", $model->id, PDO::PARAM_INT);
            $s->execute();

            foreach ($model->valueList as $value) {
                $value->unitId = $model->id;
                if ($value->id !== null) {
                    $this->valueRepository->update($value);
                } else {
                    $this->valueRepository->insert($value);
                }
            }

            array_map([$this->valueRepository, "deleteById"], $toDeleteIdList);
            $this->db->commit();
            $result = $this->selectById($model->id, false);
        } catch (Throwable $err) {
            $this->db->rollback();
            $result = WPErrorBuilder::internalServerError($err->getMessage(), $err->getTraceAsString());
        }

        return $result;
    }

    public function selectById(int $id, bool $cache = true): ?UnitModel
    {
        $m = parent::selectById($id, $cache);

        if ($m !== null && ($cache === false || $m->valueList === null)) {
            $m->valueList = $this->valueRepository->selectByUnitId($m->id);
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

    public function deleteById(int $id): bool|WP_Error
    {
        try {
            $this->db->transaction();
            $this->formValueRepository->unsetUnitValueIdByUnitId($id);
            $this->fieldRepository->unsetUnitIdByUnitId($id);
            $output = parent::deleteById($id);
            $this->db->commit();
            return $output;
        } catch (Throwable $err) {
            $this->db->rollback();
            return WPErrorBuilder::internalServerError($err->getMessage(), $err->getTraceAsString());
        }
    }
}
