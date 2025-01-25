<?php

namespace mate\model;

use mate\abstract\clazz\Model;
use UnitValueModel;

class UnitModel extends Model
{
    public ?int $id = null;
    public string $name;
    public string $description;

    /** @var UnitValueModel[]|ValueDTO[]|null */
    public ?array $valueList = null;
}
