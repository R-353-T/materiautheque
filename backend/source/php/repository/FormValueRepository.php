<?php

namespace mate\repository;

use mate\abstract\clazz\Repository;
use mate\model\FormValueModel;
use mate\SQL;
use mate\util\SqlSelectQueryOptions;
use PDO;

class FormValueRepository extends Repository
{
    protected string $table = "mate_form_value";
    protected string $model = FormValueModel::class;

    public function insert($model): ?object
    {
        $s = $this->db->prepare(SQL::FORM_VALUE_INSERT);
        $s->bindValue(":formId", $model->formId, PDO::PARAM_INT);
        $s->bindValue(":fieldId", $model->fieldId, PDO::PARAM_INT);
        $s->bindValue(":unitValueId", $model->unitValueId, PDO::PARAM_INT);
        $s->bindValue(":text", $model->text, PDO::PARAM_STR);
        $s->bindValue(":number", $model->number, PDO::PARAM_STR);
        $s->bindValue(":boolean", $model->boolean, PDO::PARAM_BOOL);
        $s->bindValue(":date", $model->date, PDO::PARAM_STR);
        $s->bindValue(":exId", $model->exId, PDO::PARAM_INT);
        $s->execute();
        $model->id = $this->db->lastInsertId();
        return $model;
    }

    public function update($model): ?object
    {
        $s = $this->db->prepare(SQL::FORM_VALUE_UPDATE);
        $s->bindValue(":unitValueId", $model->unitValueId, PDO::PARAM_INT);
        $s->bindValue(":text", $model->text, PDO::PARAM_STR);
        $s->bindValue(":number", $model->number, PDO::PARAM_STR);
        $s->bindValue(":boolean", $model->boolean, PDO::PARAM_BOOL);
        $s->bindValue(":date", $model->date, PDO::PARAM_STR);
        $s->bindValue(":exId", $model->exId, PDO::PARAM_INT);
        $s->bindValue(":id", $model->id, PDO::PARAM_INT);
        $s->execute();
        return $model;
    }

    public function selectByFormId(int $formId): array
    {
        $sqlOptions = new SqlSelectQueryOptions();
        $sqlOptions->where("formId", "=", $formId, PDO::PARAM_INT);
        return $this->selectAll($sqlOptions);
    }

    public function unsetUnitValueIdByUnitId(int $unitId): void
    {
        $stmt = $this->db->prepare(SQL::FORM_VALUE_UNSET_UNIT_VALUE_ID_BY_UNIT_ID);
        $stmt->bindValue(":unitId", $unitId, PDO::PARAM_INT);
        $stmt->execute();
    }

    public function unsetUnitValueIdByUnitValueId(int $unitValueId): void
    {
        $stmt = $this->db->prepare(SQL::FORM_VALUE_UNSET_UNIT_VALUE_ID_BY_UNIT_VALUE_ID);
        $stmt->bindValue(":unitValueId", $unitValueId, PDO::PARAM_INT);
        $stmt->execute();
    }

    public function deleteByEnumeratorId(int $enumId): void
    {
        $stmt = $this->db->prepare(SQL::FORM_VALUE_DELETE_BY_ENUMERATOR_ID);
        $stmt->bindValue(":enumeratorId", $enumId, PDO::PARAM_INT);
        $stmt->execute();
    }

    public function deleleteByEnumeratorValueId(int $enumValueId): void
    {
        $stmt = $this->db->prepare(SQL::FORM_VALUE_DELETE_BY_ENUMERATOR_VALUE_ID);
        $stmt->bindValue(":enumValueId", $enumValueId, PDO::PARAM_INT);
        $stmt->execute();
    }
}
