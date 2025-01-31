<?php

namespace mate\model;

use mate\abstract\clazz\Model;

class EnumeratorModel extends Model
{
    public ?int $id;
    public string $name;
    public string $description;
    public int $typeId;

    /** @var EnumeratorValueModel[]|ValueDto[]|null */
    public ?array $valueList = null;
}
