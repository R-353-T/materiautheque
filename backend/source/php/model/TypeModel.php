<?php

namespace mate\model;

use mate\abstract\clazz\Model;

class TypeModel extends Model
{
    public ?int $pid = null;
    public int $id;
    public string $name;
    public string $column;
    public bool $allowEnumeration;
    public bool $allowMultipleValues;
}
