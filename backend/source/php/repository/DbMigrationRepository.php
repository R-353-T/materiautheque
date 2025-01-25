<?php

namespace mate\repository;

use mate\abstract\clazz\Repository;
use mate\model\DbMigrationModel;
use PDO;

class DbMigrationRepository extends Repository
{
    protected string $table = 'mate_theme_db_migration';
    protected string $model = DbMigrationModel::class;

    public function insert($model): ?object
    {
        $s = $this->db->prepare("INSERT INTO {$this->table} (`name`) VALUES (:name)");
        $s->bindValue(":name", $model->name, PDO::PARAM_STR);
        $s->execute();
        return $this->selectById($this->db->lastInsertId());
    }

    public function selectNameList(): array
    {
        $s = $this->db->prepare("SELECT `name` FROM {$this->table}");
        $s->execute();
        return $s->fetchAll(PDO::FETCH_COLUMN);
    }
}
