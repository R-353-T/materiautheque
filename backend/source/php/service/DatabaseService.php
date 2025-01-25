<?php

namespace mate\service;

use mate\abstract\clazz\Service;
use PDO;
use PDOStatement;

class DatabaseService extends Service
{
    public ?PDO $pdo;

    public function __construct()
    {
        if (!isset($this->pdo)) {
            $connection_string = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $this->pdo = new PDO($connection_string, DB_USER, DB_PASSWORD);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }
    }

    public function prepare(string $query): PDOStatement|false
    {
        return $this->pdo->prepare($query);
    }

    public function transaction(): void
    {
        $this->pdo->beginTransaction();
    }

    public function commit(): void
    {
        $this->pdo->commit();
    }

    public function rollback(): void
    {
        $this->pdo->rollBack();
    }

    public function lastInsertId(): int
    {
        return $this->pdo->lastInsertId();
    }
}
