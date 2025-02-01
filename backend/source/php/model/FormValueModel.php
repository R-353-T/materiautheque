<?php

namespace mate\model;

use mate\abstract\clazz\Model;

class FormValueModel extends Model
{
    public ?int $id = null;
    public int $formId;
    public int $fieldId;
    public ?int $unitValueId = null;

    public ?string $text = null;
    public int|float|null $number = null;
    public ?bool $boolean = null;
    public ?string $date = null;
    public ?int $exId = null;
}
