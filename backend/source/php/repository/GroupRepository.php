<?php

namespace mate\repository;

use mate\abstract\clazz\Repository;
use mate\error\WPErrorBuilder;
use mate\model\FieldModel;
use mate\model\GroupModel;
use mate\SQL;
use PDO;
use Throwable;

class GroupRepository extends Repository
{
    protected string $model = GroupModel::class;
    protected string $table = "mate_template_group";

    private readonly FieldRepository $fieldRepository;

    public function __construct()
    {
        parent::__construct();
        $this->fieldRepository = FieldRepository::inject();
    }

    public function insert($model): ?object
    {
        $result = null;
        $parentIdArr = $model->parentId !== null
            ? [$model->parentId, PDO::PARAM_INT]
            : [null, PDO::PARAM_INT];

        try {
            $this->db->transaction();
            $s = $this->db->prepare(SQL::GROUP_INSERT);
            $s->bindValue(":name", $model->name, PDO::PARAM_STR);
            $s->bindValue(":description", $model->description, PDO::PARAM_STR);
            $s->bindValue(":templateId", $model->templateId, PDO::PARAM_INT);
            $s->bindValue(":parentId", ...$parentIdArr);
            $s->execute();
            $model->id = $this->db->lastInsertId();
            $this->db->commit();
            $result = $this->selectById($model->id, false);
        } catch (Throwable $err) {
            $this->db->rollback();
            $result = WPErrorBuilder::internalServerError(
                $err->getMessage(),
                $err->getTraceAsString()
            );
        }

        return $result;
    }

    public function update($model): ?object
    {
        $result = null;
        $previousModel = $this->selectById($model->id);
        $parentIdArr = $model->parentId !== null
            ? [$model->parentId, PDO::PARAM_INT]
            : [null, PDO::PARAM_INT];

        try {
            $this->db->transaction();
            $s = $this->db->prepare(SQL::GROUP_UPDATE);
            $s->bindValue(":name", $model->name, PDO::PARAM_STR);
            $s->bindValue(":description", $model->description, PDO::PARAM_STR);
            $s->bindValue(":parentId", ...$parentIdArr);
            $s->bindValue(":id", $model->id, PDO::PARAM_INT);
            $s->execute();

            if ($model->groupList !== null) {
                $childIdList = array_map(fn($childGroup) => $childGroup->id, $model->groupList);
                $originChildIdList = array_map(fn($childGroup) => $childGroup->id, $previousModel->groupList);
                $missed = array_diff($originChildIdList, $childIdList);

                if (count($missed) > 0) {
                    $position = count($childIdList);
                    foreach ($missed as $id) {
                        $cg = new GroupModel();
                        $cg->id = $id;
                        $cg->position = $position + 1;
                        $model->groupList[] = $cg;
                        $position++;
                    }
                }

                foreach ($model->groupList as $childGroup) {
                    $this->updatePositionById($childGroup->id, $childGroup->position);
                }
            }

            if ($model->fieldList !== null) {
                $fieldIdList = array_map(fn($field) => $field->id, $model->fieldList);
                $originFieldIdList = array_map(fn($field) => $field->id, $previousModel->fieldList);

                $missed = array_diff($originFieldIdList, $fieldIdList);

                if (count($missed) > 0) {
                    $position = count($fieldIdList);
                    foreach ($missed as $id) {
                        $f = new FieldModel();
                        $f->id = $id;
                        $f->position = $position + 1;
                        $model->fieldList[] = $f;
                        $position++;
                    }
                }

                foreach ($model->fieldList as $field) {
                    $this->fieldRepository->updatePositionById($field->id, $field->position);
                }
            }

            $this->db->commit();
            $result = $this->selectById($model->id, false);
        } catch (Throwable $err) {
            $this->db->rollback();
            $result = WPErrorBuilder::internalServerError(
                $err->getMessage(),
                $err->getTraceAsString()
            );
        }

        return $result;
    }

    public function updatePositionById(int $id, int $position)
    {
        $s = $this->db->prepare(SQL::GROUP_UPDATE_POSITION);
        $s->bindValue(":position", $position, PDO::PARAM_INT);
        $s->bindValue(":id", $id, PDO::PARAM_INT);
        $s->execute();
    }

    public function selectGroupListByTemplateId(int $templateId, bool $recursive = false)
    {
        $s = $this->db->prepare(SQL::GROUP_SELECT_BY_TEMPLATE_ID);
        $s->bindValue(":templateId", $templateId, PDO::PARAM_INT);
        $s->execute();
        $groupList = $s->fetchAll(PDO::FETCH_CLASS, $this->model);

        foreach ($groupList as $group) {
            if ($recursive) {
                array_push($groupList, ...$this->selectGroupListByTemplateId($group->id, $recursive));
            }
        }

        return $groupList;
    }

    public function selectGroupListByGroupId(int $groupId, bool $recursive = false)
    {
        $s = $this->db->prepare(SQL::GROUP_SELECT_BY_PARENT_ID);
        $s->bindValue(":parentId", $groupId, PDO::PARAM_INT);
        $s->execute();
        $groupList = $s->fetchAll(PDO::FETCH_CLASS, $this->model);

        foreach ($groupList as $group) {
            if ($recursive) {
                array_push($groupList, ...$this->selectGroupListByGroupId($group->id, $recursive));
            }
        }

        return $groupList;
    }

    public function selectById(int $id, bool $cache = true): ?object
    {
        $model = parent::selectById($id, $cache);

        if ($model !== null) {
            $model->groupList = $this->selectGroupListByGroupId($model->id);
            $model->fieldList = $this->fieldRepository->selectFieldListByGroupId($model->id);
        }

        return $model;
    }

    public function containsGroupId(int $id, int $groupId): bool
    {
        $model = $this->selectById($id);

        return $model !== null
            ? count(array_filter($model->groupList, fn($g) => $g->id === $groupId)) > 0
            : false;
    }

    public function containsFieldId(int $id, int $fieldId): bool
    {
        $model = $this->selectById($id);

        return $model !== null
            ? count(array_filter($model->fieldList, fn($f) => $f->id === $fieldId)) > 0
            : false;
    }

    public function circularParentId(int $groupId, int $parentId): bool
    {
        $groupList = $this->selectGroupListByGroupId($groupId, true);
        $groupIdList = array_map(fn($c) => $c->id, $groupList);
        $groupIdList[] = $groupId;

        return in_array($parentId, $groupIdList);
    }
}
