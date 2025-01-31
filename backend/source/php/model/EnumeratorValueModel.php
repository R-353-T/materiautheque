<?php

namespace mate\model;

use mate\abstract\clazz\Model;

class EnumeratorValueModel extends Model
{
    public ?int $id = null;
    public ?string $text = null;
    public int|float|null $number = null;
    public ?string $date = null;
    public int $enumeratorId;
    public int $position;
}
