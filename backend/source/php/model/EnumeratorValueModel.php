<?php

namespace mate\model;

use mate\abstract\clazz\Model;

class EnumeratorValueModel extends Model
{
    public ?int $id = null;
    public ?string $text = null;
    public float|int|null $number = null;
    public ?string $date = null;
    public int $enumeratorId;
    public int $position;
}
