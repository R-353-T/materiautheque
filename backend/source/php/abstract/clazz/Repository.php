<?php

namespace mate\abstract\clazz;

use mate\abstract\trait\Singleton;
use mate\error\NotImplementedError;
use mate\service\DatabaseService;
use mate\util\SqlSelectQueryOptions;
use PDO;

use function Avifinfo\read;

abstract class Repository
{
    use Singleton;

    protected string $table;
    protected string $model;
    protected readonly DatabaseService $db;

    public function __construct()
    {
        $this->db = DatabaseService::inject();
    }

    public function getTable(): string
    {
        return $this->table;
    }

    public function getModel(): string
    {
        return $this->model;
    }

    public function insert($model): ?object
    {
        throw new NotImplementedError();
    }

    public function update($model): ?object
    {
        throw new NotImplementedError();
    }

    public function selectById($id): ?object
    {
        $s = $this->db->prepare("SELECT * FROM {$this->table} WHERE `id` = :id");
        $s->bindValue(":id", $id, PDO::PARAM_INT);
        $s->execute();
        $s->setFetchMode(PDO::FETCH_CLASS, $this->model);
        $m = $s->fetch();
        return $m !== false ? $m : null;
    }

    public function select(SqlSelectQueryOptions $options = null): array
    {
        $options = $options ?? new SqlSelectQueryOptions();

        $q = <<<SQL
        SELECT * FROM {$this->table}
        {$options->getWhereQuery()}
        {$options->getOrderByQuery()}
        {$options->getPaginationQuery()}
        SQL;

        $s = $this->db->prepare($q);
        $options->applyWhereBinds($s);
        $s->execute();
        return $s->fetchAll(PDO::FETCH_CLASS, $this->model);
    }

    public function deleteById($id): bool
    {
        $s = $this->db->prepare("DELETE FROM {$this->table} WHERE `id` = :id");
        $s->bindValue(":id", $id, PDO::PARAM_INT);
        $s->execute();
        return $s->rowCount() > 0;
    }

    public function getCount(SqlSelectQueryOptions $options = null): int
    {
        $options = $options ?? new SqlSelectQueryOptions();
        $s = $this->db->prepare("SELECT COUNT(*) FROM {$this->table} {$options->getWhereQuery()}");
        $options->applyWhereBinds($s);
        $s->execute();
        return $s->fetchColumn();
    }

    public function getPageCount(SqlSelectQueryOptions $options = null): int
    {
        $options = $options ?? new SqlSelectQueryOptions();
        $c = $this->getCount($options);
        return ceil($c / $options->pageSize);
    }
}
