<?php

namespace mate\util;

use PDOStatement;

class SqlSelectQueryOptions
{
    public readonly ?int $pageIndex;
    public readonly ?int $pageSize;

    private array $whereList = [];
    private array $whereRawList = [];
    private array $orderByList = [];

    public function __construct(int|null $pageIndex = null, int|null $pageSize = null)
    {
        $this->pageIndex = $pageIndex;
        $this->pageSize = $pageSize;
    }

    public function where(string $column, string $operator, mixed $value, int $pdo, bool $and = true)
    {
        $this->whereList[] = [
            $column,
            $operator,
            $value,
            $pdo,
            $and
        ];
    }

    /**
     * $binds array of values to bind [string name, mixed value, int pdo]
     */
    public function whereRaw(string $query, array $binds = [], bool $and = true)
    {
        $this->whereRawList[] = [
            $query,
            $binds,
            $and
        ];
    }

    public function getWhereQuery(): string
    {
        $q = "";

        if (count($this->whereList) > 0 || count($this->whereRawList) > 0) {
            $q = "WHERE 1=1";
        }

        foreach ($this->whereList as $i => $w) {
            $q .= ($w[4] ? " AND " : " OR ") . "{$w[0]} {$w[1]} :w{$i}";
        }

        foreach ($this->whereRawList as $i => $w) {
            $q .= ($w[2] ? " AND " : " OR ") . $w[0];
        }

        return $q;
    }

    public function applyWhereBinds(PDOStatement $s)
    {
        foreach ($this->whereList as $i => $w) {
            $s->bindValue(":w{$i}", $w[2], $w[3]);
        }

        foreach ($this->whereRawList as $i => $w) {
            foreach ($w[1] as $b) {
                $s->bindValue(...$b);
            }
        }
    }

    public function orderBy(string $column, string $order = 'ASC')
    {
        $this->orderByList[] = [ $column, $order ];
    }

    public function getOrderByQuery(): string
    {
        $q = "";
        $c = count($this->orderByList);

        if ($c > 0) {
            $q = "ORDER BY ";

            foreach ($this->orderByList as $i => $o) {
                $q .= "{$o[0]} {$o[1]}";

                if ($i < $c - 1) {
                    $q .= ", ";
                }
            }
        }

        return $q;
    }

    public function getPaginationQuery(): string
    {
        $q = "";

        if ($this->pageIndex !== null && $this->pageSize !== null) {
            $offset = $this->pageSize * ($this->pageIndex - 1);
            $q = "LIMIT {$this->pageSize} OFFSET {$offset}";
        }

        return $q;
    }
}
