<?php

namespace mate\model;

use mate\abstract\clazz\Model;

class ImageModel extends Model
{
    public ?int $id = null;
    public string $name;
    public string $relative;

    public ?array $file = null;
    public ?string $url = null;
}
