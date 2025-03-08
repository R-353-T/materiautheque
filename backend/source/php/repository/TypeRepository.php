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
        $options = new SqlSelectQueryOptions();
        $options->orderBy("name", "ASC");
        $typeList = parent::selectAll($options);

        foreach ($typeList as $type) {
            $this->cache->set($type->id, $type);
        }

        return $typeList;
    }
}
