<?php

namespace mate\repository;

use mate\abstract\clazz\Repository;
use mate\model\EnumeratorValueModel;
use mate\util\SqlSelectQueryOptions;
use PDO;

class EnumeratorValueRepository extends Repository
{
    protected string $table = "mate_enumerator_value";
    protected string $model = EnumeratorValueModel::class;

    public function insert($model): ?object
    {
        $q = <<<SQL
        INSERT INTO {$this->table} (
            `enumeratorId`,
            `position`,
            `text`,
            `number`,
            `date`
        )
        VALUES (
            :enumeratorId,
            :position,
            :text,
            :number,
            :date
        )
        SQL;

        $s = $this->db->prepare($q);
        $s->bindValue(":enumeratorId", $model->enumeratorId, PDO::PARAM_INT);
        $s->bindValue(":position", $model->position, PDO::PARAM_INT);
        $s->bindValue(":text", $model->text, PDO::PARAM_STR);
        $s->bindValue(":number", $model->number, PDO::PARAM_STR);
        $s->bindValue(":date", $model->date, PDO::PARAM_STR);
        $s->execute();
        $model->id = $this->db->lastInsertId();
        return $model;
    }

    public function update($model): ?object
    {
        $q = <<<SQL
        UPDATE {$this->table}
        SET
        `enumeratorId` = :enumeratorId,
        `position` = :position,
        `text` = :text,
        `number` = :number,
        `date` = :date
        WHERE `id` = :id
        SQL;

        $s = $this->db->prepare($q);
        $s->bindValue(":enumeratorId", $model->enumeratorId, PDO::PARAM_INT);
        $s->bindValue(":position", $model->position, PDO::PARAM_INT);
        $s->bindValue(":text", $model->text, PDO::PARAM_STR);
        $s->bindValue(":number", $model->number, PDO::PARAM_STR);
        $s->bindValue(":date", $model->date, PDO::PARAM_STR);
        $s->bindValue(":id", $model->id, PDO::PARAM_INT);
        $s->execute();
        return $model;
    }

    public function selectByEnumeratorId(int $enumeratorId): array
    {
        $sqlOptions = new SqlSelectQueryOptions();
        $sqlOptions->where("enumeratorId", "=", $enumeratorId, PDO::PARAM_INT);
        $sqlOptions->orderBy("position", "ASC");
        return $this->selectAll($sqlOptions);
    }

    public function deleteByEnumeratorId(int $enumeratorId): void
    {
        $q = <<<SQL
        DELETE FROM {$this->table}
        WHERE `enumeratorId` = :enumeratorId
        SQL;
        $s = $this->db->prepare($q);
        $s->bindValue(":enumeratorId", $enumeratorId, PDO::PARAM_INT);
        $s->execute();
    }
}
