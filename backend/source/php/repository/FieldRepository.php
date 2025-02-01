<?php

namespace mate\repository;

use mate\abstract\clazz\Repository;
use mate\error\WPErrorBuilder;
use mate\model\FieldModel;
use PDO;
use Throwable;

class FieldRepository extends Repository
{
    protected string $table = "mate_template_field";
    protected string $model = FieldModel::class;

    public function insert($model): ?object
    {
        $this->db->transaction();
        $q = <<<SQL
        INSERT INTO {$this->table} (
            `name`,
            `description`,
            `allowMultipleValues`,
            `isRequired`,
            `groupId`,
            `position`,

            `typeId`,
            `enumeratorId`,
            `unitId`
        ) VALUES (
            :name,
            :description,
            :allowMultipleValues,
            :isRequired,
            :groupId,
            0,

            :typeId,
            :enumeratorId,
            :unitId
        )
        SQL;

        try {
            $s = $this->db->prepare($q);
            $s->bindValue(":name", $model->name, PDO::PARAM_STR);
            $s->bindValue(":description", $model->description, PDO::PARAM_STR);
            $s->bindValue(":allowMultipleValues", $model->allowMultipleValues, PDO::PARAM_BOOL);
            $s->bindValue(":isRequired", $model->isRequired, PDO::PARAM_BOOL);
            $s->bindValue(":groupId", $model->groupId, PDO::PARAM_INT);

            $s->bindValue(
                ":typeId",
                ($model->typeId !== 0 ? $model->typeId : null),
                ($model->typeId !== 0 ? PDO::PARAM_INT : PDO::PARAM_NULL)
            );

            $s->bindValue(
                ":enumeratorId",
                ($model->enumeratorId !== 0 ? $model->enumeratorId : null),
                ($model->enumeratorId !== 0 ? PDO::PARAM_INT : PDO::PARAM_NULL)
            );

            $s->bindValue(
                ":unitId",
                ($model->unitId !== 0 ? $model->unitId : null),
                ($model->unitId !== 0 ? PDO::PARAM_INT : PDO::PARAM_NULL)
            );

            $s->execute();
            $model->id = $this->db->lastInsertId();

            $this->db->commit();
            return $model;
        } catch (Throwable $err) {
            $this->db->rollback();
            return WPErrorBuilder::internalServerError($err->getMessage(), $err->getTraceAsString());
        }
    }

    public function update($model): ?object
    {
        $this->db->transaction();
        $q = <<<SQL
        UPDATE {$this->table}
        SET `name` = :name,
            `description` = :description,
            `allowMultipleValues` = :allowMultipleValues,
            `isRequired` = :isRequired,
            `groupId` = :groupId,
            `typeId` = :typeId,
            `enumeratorId` = :enumeratorId,
            `unitId` = :unitId
        WHERE `id` = :id
        SQL;

        try {
            $stmt = $this->db->prepare($q);
            $stmt->bindValue(":name", $model->name, PDO::PARAM_STR);
            $stmt->bindValue(":description", $model->description, PDO::PARAM_STR);
            $stmt->bindValue(":allowMultipleValues", $model->allowMultipleValues, PDO::PARAM_BOOL);
            $stmt->bindValue(":isRequired", $model->isRequired, PDO::PARAM_BOOL);
            $stmt->bindValue(":groupId", $model->groupId, PDO::PARAM_INT);

            $stmt->bindValue(
                ":typeId",
                $model->typeId,
                ($model->typeId ? PDO::PARAM_INT : PDO::PARAM_NULL)
            );

            $stmt->bindValue(
                ":enumeratorId",
                $model->enumeratorId,
                ($model->enumeratorId ? PDO::PARAM_INT : PDO::PARAM_NULL)
            );

            $stmt->bindValue(
                ":unitId",
                $model->unitId,
                ($model->unitId ? PDO::PARAM_INT : PDO::PARAM_NULL)
            );

            $stmt->bindValue(":id", $model->id, PDO::PARAM_INT);
            $stmt->execute();

            $this->db->commit();
            return $model;
        } catch (Throwable $err) {
            $this->db->rollback();
            return WPErrorBuilder::internalServerError($err->getMessage(), $err->getTraceAsString());
        }
    }

    public function updatePositionById(int $id, int $position)
    {
        $q = <<<SQL
        UPDATE {$this->table}
        SET `position` = :position
        WHERE `id` = :id
        SQL;
        $s = $this->db->prepare($q);
        $s->bindValue(":position", $position, PDO::PARAM_INT);
        $s->bindValue(":id", $id, PDO::PARAM_INT);
        $s->execute();
    }

    public function selectByGroupId(int $groupId): array
    {
        $q = <<<SQL
        SELECT *
        FROM {$this->table}
        WHERE `groupId` = :groupId
        ORDER BY `position` ASC
        SQL;

        $stmt = $this->db->prepare($q);
        $stmt->bindValue(":groupId", $groupId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_CLASS, $this->model);
    }
}
