<?php

namespace mate\repository;

use mate\abstract\clazz\Repository;
use mate\model\UnitValueModel;
use mate\util\SqlSelectQueryOptions;
use PDO;

class UnitValueRepository extends Repository
{
    protected string $table = "mate_unit_value";
    protected string $model = UnitValueModel::class;

    public function insert($model): ?object
    {
        $q = <<<SQL
        INSERT INTO {$this->table} (`value`, `unitId`, `position`)
        VALUES (:value, :unitId, :position)
        SQL;

        $s = $this->db->prepare($q);
        $s->bindValue(":value", $model->value, PDO::PARAM_STR);
        $s->bindValue(":unitId", $model->unitId, PDO::PARAM_INT);
        $s->bindValue(":position", $model->position, PDO::PARAM_INT);
        $s->execute();
        $model->id = $this->db->lastInsertId();
        return $model;
    }

    public function update($model): ?object
    {
        $q = <<<SQL
        UPDATE {$this->table}
        SET `value` = :value, `position` = :position
        WHERE `id` = :id
        SQL;

        $s = $this->db->prepare($q);
        $s->bindValue(":value", $model->value, PDO::PARAM_STR);
        $s->bindValue(":position", $model->position, PDO::PARAM_INT);
        $s->bindValue(":id", $model->id, PDO::PARAM_INT);
        $s->execute();
        return $model;
    }

    public function selectByUnitId(int $unitId): array
    {
        $sqlOptions = new SqlSelectQueryOptions();
        $sqlOptions->where("unitId", "=", $unitId, PDO::PARAM_INT);
        $sqlOptions->orderBy("position", "ASC");
        return $this->selectAll($sqlOptions);
    }
}
