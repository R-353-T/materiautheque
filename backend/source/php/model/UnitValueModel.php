<?php

namespace mate\model;

use mate\abstract\clazz\Model;

class UnitValueModel extends Model
{
    public ?int $id = null;
    public string $value;
    public int $unitId;
    public int $position;
}
