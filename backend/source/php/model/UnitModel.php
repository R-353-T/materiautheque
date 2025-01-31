<?php

namespace mate\model;

use mate\abstract\clazz\Model;

class UnitModel extends Model
{
    public ?int $id = null;
    public string $name;
    public string $description;

    /** @var UnitValueModel[]|ValueDto[|null */
    public ?array $valueList = null;
}
