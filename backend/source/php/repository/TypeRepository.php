<?php

namespace mate\repository;

use mate\abstract\clazz\Repository;
use mate\model\TypeModel;
use mate\util\SqlSelectQueryOptions;

class TypeRepository extends Repository
{
    protected string $table = "mate_type";
    protected string $model = TypeModel::class;

    public function selectAll(?SqlSelectQueryOptions $options = null): array
    {
        $r = parent::selectAll($options);

        foreach ($r as $model) {
            $this->cache->set($model->id, $model);
        }

        return $r;
    }
}
