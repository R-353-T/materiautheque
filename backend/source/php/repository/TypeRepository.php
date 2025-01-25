<?php

namespace mate\repository;

use mate\abstract\clazz\Repository;
use mate\model\TypeModel;

class TypeRepository extends Repository
{
    protected string $table = "mate_type";
    protected string $model = TypeModel::class;
}
