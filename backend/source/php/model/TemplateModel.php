<?php

namespace mate\model;

use mate\abstract\clazz\Model;

class TemplateModel extends Model
{
    public ?int $id = null;
    public string $name;

    /** @var GroupModel[]|null */
    public ?array $groupList = null;
}
