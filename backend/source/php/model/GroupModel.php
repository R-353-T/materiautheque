<?php

namespace mate\model;

use mate\abstract\clazz\Model;

class GroupModel extends Model
{
    public ?int $id = null;
    public string $name;
    public string $description;
    public int $position;
    public int $templateId;
    public ?int $parentId = null;

    /** @var GroupModel[]|null */
    public ?array $childGroupList = null;

    /** @var FieldModel[]|null */
    public ?array $fieldList = null;
}
