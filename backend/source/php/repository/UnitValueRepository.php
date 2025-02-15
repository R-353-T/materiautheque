<?php

namespace mate\repository;

use mate\abstract\clazz\Repository;
use mate\model\UnitValueModel;
use mate\SQL;
use mate\util\SqlSelectQueryOptions;
use PDO;
use WP_Error;

class UnitValueRepository extends Repository
{
    protected string $table = "mate_unit_value";
    protected string $model = UnitValueModel::class;

    private readonly FormValueRepository $formValueRepository;

    public function __construct()
    {
        $this->formValueRepository = FormValueRepository::inject();
    }

    public function insert($model): ?object
    {
        $s = $this->db->prepare(SQL::UNIT_VALUE_INSERT);
        $s->bindValue(":value", $model->value, PDO::PARAM_STR);
        $s->bindValue(":unitId", $model->unitId, PDO::PARAM_INT);
        $s->bindValue(":position", $model->position, PDO::PARAM_INT);
        $s->execute();
        $model->id = $this->db->lastInsertId();
        return $model;
    }

    public function update($model): ?object
    {
        $s = $this->db->prepare(SQL::UNIT_VALUE_UPDATE);
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

    public function deleteById(int $id): bool|WP_Error
    {
        $this->formValueRepository->unsetUnitValueIdByUnitValueId($id);
        return parent::deleteById($id);
    }
}
