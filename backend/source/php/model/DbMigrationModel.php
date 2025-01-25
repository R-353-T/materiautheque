<?php

namespace mate\model;

use mate\abstract\clazz\Model;

class DbMigrationModel extends Model
{
    public ?int $id;
    public string $name;
    public string $migratedAt;
}
