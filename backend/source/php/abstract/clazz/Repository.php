<?php

namespace mate\abstract\clazz;

use mate\error\NotImplementedError;
use mate\service\DatabaseService;
use mate\util\HashMap;
use mate\util\SqlSelectQueryOptions;
use PDO;
use WP_Error;

abstract class Repository extends Service
{
    protected string $table;
    protected string $model;
    protected readonly HashMap $cache;
    protected readonly DatabaseService $db;

    public function __construct()
    {
        $this->db = DatabaseService::inject();
        $this->cache = new HashMap();
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

    public function selectById(int $id, bool $cache = true): ?object
    {
        if ($cache && $this->cache->has($id)) {
            return $this->cache->get($id);
        }

        $s = $this->db->prepare("SELECT * FROM {$this->table} WHERE `id` = :id");
        $s->bindValue(":id", $id, PDO::PARAM_INT);
        $s->execute();
        $s->setFetchMode(PDO::FETCH_CLASS, $this->model);
        $m = $s->fetch();

        if ($m !== false) {
            $this->cache->set($m->id, $m);
            return $m;
        } else {
            return null;
        }
    }

    public function selectAll(SqlSelectQueryOptions|null $options = null): array
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

    public function deleteById(int $id): bool|WP_Error
    {
        $s = $this->db->prepare("DELETE FROM {$this->table} WHERE `id` = :id");
        $s->bindValue(":id", $id, PDO::PARAM_INT);
        $s->execute();

        if ($this->cache->has($id)) {
            $this->cache->remove($id);
        }

        return $s->rowCount() > 0;
    }

    public function getCount(SqlSelectQueryOptions|null $options = null): int
    {
        $options = $options ?? new SqlSelectQueryOptions();
        $s = $this->db->prepare("SELECT COUNT(*) FROM {$this->table} {$options->getWhereQuery()}");
        $options->applyWhereBinds($s);
        $s->execute();
        return $s->fetchColumn();
    }

    public function getPageCount(SqlSelectQueryOptions|null $options = null): int
    {
        $options = $options ?? new SqlSelectQueryOptions();
        $c = $this->getCount($options);
        return $c === 0 ? 1 : ceil($c / $options->pageSize);
    }
}
