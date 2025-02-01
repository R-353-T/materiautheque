<?php

namespace mate\model;

use mate\abstract\clazz\Model;

class FieldModel extends Model
{
    public ?int $id = null;
    public string $name;
    public string $description;
    public bool $allowMultipleValues;
    public bool $isRequired;
    public int $groupId;
    public int $position;

    public ?int $typeId = null;
    public ?int $enumeratorId = null;
    public ?int $unitId = null;
}
