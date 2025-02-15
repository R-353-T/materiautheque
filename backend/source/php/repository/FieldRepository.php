<?php

namespace mate\repository;

use mate\abstract\clazz\Repository;
use mate\error\WPErrorBuilder;
use mate\model\FieldModel;
use mate\SQL;
use PDO;
use Throwable;

class FieldRepository extends Repository
{
    protected string $table = "mate_template_field";
    protected string $model = FieldModel::class;

    public function insert($model): ?object
    {
        $result = null;

        $typeIdArr = $model->typeId !== null
            ? [$model->typeId, PDO::PARAM_INT]
            : [null, PDO::PARAM_INT];

        $enumeratorIdArr = $model->enumeratorId !== null
            ? [$model->enumeratorId, PDO::PARAM_INT]
            : [null, PDO::PARAM_INT];

        $unitIdArr = $model->unitId !== null
            ? [$model->unitId, PDO::PARAM_INT]
            : [null, PDO::PARAM_INT];

        try {
            $this->db->transaction();
            $s = $this->db->prepare(SQL::FIELD_INSERT);
            $s->bindValue(":name", $model->name, PDO::PARAM_STR);
            $s->bindValue(":description", $model->description, PDO::PARAM_STR);
            $s->bindValue(":allowMultipleValues", $model->allowMultipleValues, PDO::PARAM_BOOL);
            $s->bindValue(":isRequired", $model->isRequired, PDO::PARAM_BOOL);
            $s->bindValue(":groupId", $model->groupId, PDO::PARAM_INT);
            $s->bindValue(":typeId", ...$typeIdArr);
            $s->bindValue(":enumeratorId", ...$enumeratorIdArr);
            $s->bindValue(":unitId", ...$unitIdArr);
            $s->execute();
            $model->id = $this->db->lastInsertId();
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

        $typeIdArr = $model->typeId !== null
            ? [$model->typeId, PDO::PARAM_INT]
            : [null, PDO::PARAM_INT];

        $enumeratorIdArr = $model->enumeratorId !== null
            ? [$model->enumeratorId, PDO::PARAM_INT]
            : [null, PDO::PARAM_INT];

        $unitIdArr = $model->unitId !== null
            ? [$model->unitId, PDO::PARAM_INT]
            : [null, PDO::PARAM_INT];

        try {
            $this->db->transaction();
            $stmt = $this->db->prepare(SQL::FIELD_UPDATE);
            $stmt->bindValue(":name", $model->name, PDO::PARAM_STR);
            $stmt->bindValue(":description", $model->description, PDO::PARAM_STR);
            $stmt->bindValue(":allowMultipleValues", $model->allowMultipleValues, PDO::PARAM_BOOL);
            $stmt->bindValue(":isRequired", $model->isRequired, PDO::PARAM_BOOL);
            $stmt->bindValue(":groupId", $model->groupId, PDO::PARAM_INT);
            $stmt->bindValue(":typeId", ...$typeIdArr);
            $stmt->bindValue(":enumeratorId", ...$enumeratorIdArr);
            $stmt->bindValue(":unitId", ...$unitIdArr);
            $stmt->bindValue(":id", $model->id, PDO::PARAM_INT);
            $stmt->execute();
            $this->db->commit();
            $result = $this->selectById($model->id, false);
        } catch (Throwable $err) {
            $this->db->rollback();
            $result = WPErrorBuilder::internalServerError($err->getMessage(), $err->getTraceAsString());
        }

        return $result;
    }

    public function updatePositionById(int $id, int $position)
    {
        $s = $this->db->prepare(SQL::FIELD_UPDATE_POSITION);
        $s->bindValue(":position", $position, PDO::PARAM_INT);
        $s->bindValue(":id", $id, PDO::PARAM_INT);
        $s->execute();
    }

    public function selectFieldListByGroupId(int $groupId): array
    {
        $stmt = $this->db->prepare(SQL::FIELD_SELECT_BY_GROUP_ID);
        $stmt->bindValue(":groupId", $groupId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_CLASS, $this->model);
    }

    public function selectFieldListByTemplateId(int $templateId): array
    {
        $stmt = $this->db->prepare(SQL::FIELD_SELECT_BY_TEMPLATE_ID);
        $stmt->bindValue(":templateId", $templateId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_CLASS, $this->model);
    }

    public function unsetUnitIdByUnitId(int $unitId)
    {
        $stmt = $this->db->prepare(SQL::FIELD_UNSET_UNIT_ID_BY_UNIT_ID);
        $stmt->bindValue(":unitId", $unitId, PDO::PARAM_INT);
        $stmt->execute();
    }
}
