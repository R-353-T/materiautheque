<?php

namespace mate\repository;

use mate\abstract\clazz\Repository;
use mate\abstract\trait\SelectByName;
use mate\error\WPErrorBuilder;
use mate\model\UnitModel;
use PDO;
use Throwable;

class UnitRepository extends Repository
{
    use SelectByName;

    protected string $table = "mate_unit";
    protected string $model = UnitModel::class;

    private readonly UnitValueRepository $valueRepository;

    public function __construct()
    {
        parent::__construct();
        $this->valueRepository = UnitValueRepository::inject();
    }

    public function insert($model): ?object
    {
        $this->db->transaction();
        $q = <<<SQL
        INSERT INTO {$this->table} (`name`, `description`)
        VALUES (:name, :description)
        SQL;

        try {
            $s = $this->db->prepare($q);
            $s->bindValue(":name", $model->name, PDO::PARAM_STR);
            $s->bindValue(":description", $model->description, PDO::PARAM_STR);
            $s->execute();
            $model->id = $this->db->lastInsertId();

            foreach ($model->valueList as $value) {
                $value->unitId = $model->id;
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
        $q = <<<SQL
        UPDATE {$this->table}
        SET `name` = :name, `description` = :description
        WHERE `id` = :id
        SQL;

        $newValueIdList = array_map(fn($nv) => $nv->id, $model->valueList);
        $previousValueIdList = array_map(fn($ov) => $ov->id, $previousModel->valueList);

        try {
            $s = $this->db->prepare($q);
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


            array_map(
                [$this->valueRepository, "deleteById"],
                array_filter($previousValueIdList, fn ($id) => !in_array($id, $newValueIdList))
            );

            $this->db->commit();
            return $this->selectById($model->id, false);
        } catch (Throwable $err) {
            $this->db->rollback();

            return WPErrorBuilder::internalServerError($err->getMessage(), $err->getTraceAsString());
        }
    }

    public function selectById(int $id, bool $cache = true): ?UnitModel
    {
        $m = parent::selectById($id, $cache);

        if ($m !== null) {
            $m->valueList = $this->valueRepository->selectByUnitId($m->id);
        }

        return $m;
    }

    public function containsValueById(int $id, int $valueId): bool
    {
        $unit = $this->selectById($id);

        if ($unit === null) {
            return false;
        } else {
            return count(array_filter($unit->valueList, fn($v) => $v->id === $valueId)) > 0;
        }
    }
}
