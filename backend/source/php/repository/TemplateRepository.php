<?php

namespace mate\repository;

use mate\abstract\clazz\Repository;
use mate\model\GroupModel;
use mate\model\TemplateModel;

class TemplateRepository extends Repository
{
    protected string $table = "mate_template";
    protected string $model = TemplateModel::class;
    private readonly GroupRepository $groupRepository;
    private readonly FieldRepository $fieldRepository;

    public function __construct()
    {
        parent::__construct();
        $this->groupRepository = GroupRepository::inject();
        $this->fieldRepository = FieldRepository::inject();
    }

    public function update($model): ?object
    {
        if ($model->childGroupList !== null) {
            foreach ($model->childGroupList as $childGroup) {
                $this->groupRepository->updatePositionById($childGroup->id, $childGroup->position);
            }
        }

        return $this->selectById($model->id);
    }

    public function selectById(int $id, bool $cache = true): ?object
    {
        $model = parent::selectById($id, $cache);

        if ($model !== null) {
            $model->childGroupList = $this->groupRepository->selectTemplateChildList($model->id);

            foreach ($model->childGroupList as $childGroup) {
                $childGroup->fieldList = $this->fieldRepository->selectByGroupId($childGroup->id);
                $this->treeGroupChildList($childGroup);
            }
        }

        return $model;
    }

    private function treeGroupChildList(GroupModel &$group): void
    {
        $group->childGroupList = $this->groupRepository->selectGroupChildList($group->id);

        foreach ($group->childGroupList as $childGroup) {
            $childGroup->fieldList = $this->fieldRepository->selectByGroupId($childGroup->id);
            $this->treeGroupChildList($childGroup);
        }
    }
}
