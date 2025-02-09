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
}
