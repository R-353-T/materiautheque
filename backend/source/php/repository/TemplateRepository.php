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
        if ($model->groupList !== null) {
            foreach ($model->groupList as $group) {
                $this->groupRepository->updatePositionById($group->id, $group->position);
            }
        }

        return $this->selectById($model->id);
    }

    public function selectById(int $id, bool $cache = true): ?object
    {
        $model = parent::selectById($id, $cache);

        if ($model !== null) {
            $model->groupList = $this->groupRepository->selectGroupListByTemplateId($model->id);

            foreach ($model->groupList as $group) {
                $group->fieldList = $this->fieldRepository->selectByGroupId($group->id);
                $this->treeGroupChildList($group);
            }
        }

        return $model;
    }

    private function treeGroupChildList(GroupModel &$group): void
    {
        $group->groupList = $this->groupRepository->selectGroupListByGroupId($group->id);

        foreach ($group->groupList as $childGroup) {
            $childGroup->fieldList = $this->fieldRepository->selectByGroupId($childGroup->id);
            $this->treeGroupChildList($childGroup);
        }
    }

    public function containsGroupId(int $id, int $groupId): bool
    {
        $model = $this->selectById($id);

        return $model !== null
            ? count(array_filter($model->groupList, fn($g) => $g->id === $groupId)) > 0
            : false;
    }
}
