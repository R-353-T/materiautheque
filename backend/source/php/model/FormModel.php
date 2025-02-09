<?php

namespace mate\model;

use mate\abstract\clazz\Model;

class FormModel extends Model
{
    public ?int $id = null;
    public string $name;
    public int $templateId;

    /** @var FormValueModel[]|ValueDto[]|null */
    public ?array $valueList = null;
}
