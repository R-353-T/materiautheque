<?php

namespace mate\validator;

use mate\enumerator\BadParameterCode as BPC;
use mate\error\BadRequestBuilder;
use mate\model\FieldModel;
use mate\model\GroupModel;
use mate\repository\GroupRepository;

class GroupValidator extends Validator
{
    public function __construct(BadRequestBuilder $brb)
    {
        parent::__construct(GroupRepository::inject(), $brb);
    }

    public function parentId(mixed $parentId, ?int $id, ?int $templateId): ?int
    {
        if ($this->brb->hasError("id", "templateId")) {
            return null;
        }

        if (($parentId = $this->id($parentId, false, "parentId")) !== null) {
            if (
                ($id === null
                && ($parent = $this->repository->selectById($parentId)) !== null
                && $parent->templateId !== $templateId)
                ||
                ($id !== null
                && ($group = $this->repository->selectById($id)) !== null
                && ($parent = $this->repository->selectById($parentId)) !== null
                && $group->templateId !== $parent->templateId)
            ) {
                $this->brb->addError("parentId", BPC::TEMPLATE_MISSMATCH);
                return null;
            }

            if ($id !== null && $this->repository->circularParentId($id, $parentId)) {
                $this->brb->addError("parentId", BPC::GROUP_CIRCULAR_REFERENCE);
            }
        } else {
            return null;
        }

        return $parentId;
    }

    public function groupList(mixed $groupList, ?int $id): ?array
    {
        if ($this->brb->hasError("id")) {
            return null;
        }

        if ($groupList === null) {
            return [];
        }

        if (mate_sanitize_array($groupList) === false) {
            $this->brb->addError("groupList", BPC::INCORRECT, BPC::DATA_INCORRECT_ARRAY);
            return null;
        }

        return array_map(
            fn($index) => $this->groupDto($groupList[$index], $index, $id),
            array_keys($groupList)
        );
    }

    public function fieldList(mixed $fieldList, ?int $id): ?array
    {
        if ($this->brb->hasError("id")) {
            return null;
        }

        if ($fieldList === null) {
            return [];
        }

        if (mate_sanitize_array($fieldList) === false) {
            $this->brb->addError("fieldList", BPC::INCORRECT, BPC::DATA_INCORRECT_ARRAY);
            return null;
        }

        return array_map(
            fn($index) => $this->fieldDto($fieldList[$index], $index, $id),
            array_keys($fieldList)
        );
    }

    private function groupDto(mixed $dto, int $index, ?int $parentId): ?GroupModel
    {
        $model = new GroupModel();
        $model->position = $index;

        if (mate_sanitize_array($dto) === false) {
            $this->brb->addError("groupList", BPC::INCORRECT, BPC::DATA_INCORRECT_ARRAY, $index);
            return null;
        }

        if (isset($dto["id"]) === false || $dto["id"] === null) {
            $this->brb->addError("groupList", BPC::REQUIRED, null, $index, "id");
            return null;
        }

        if (($id = mate_sanitize_int($dto["id"])) === false) {
            $this->brb->addError("groupList", BPC::INCORRECT, BPC::DATA_INCORRECT_INTEGER, $index, "id");
            return null;
        }

        if ($this->repository->containsGroupId($parentId, $id) === false) {
            $this->brb->addError("groupList", BPC::NOT_RELATED, null, $index, "id");
            return null;
        }

        $model->id = $id;
        return $model;
    }

    private function fieldDto(mixed $dto, int $index, ?int $groupId): ?FieldModel
    {
        $model = new FieldModel();
        $model->position = $index;

        if (mate_sanitize_array($dto) === false) {
            $this->brb->addError("fieldList", BPC::INCORRECT, BPC::DATA_INCORRECT_ARRAY, $index);
            return null;
        }

        if (isset($dto["id"]) === false || $dto["id"] === null) {
            $this->brb->addError("fieldList", BPC::REQUIRED, null, $index, "id");
        }

        if (($id = mate_sanitize_int($dto["id"])) === false) {
            $this->brb->addError("fieldList", BPC::INCORRECT, BPC::DATA_INCORRECT_INTEGER, $index, "id");
            return null;
        }

        if ($this->repository->containsFieldId($groupId, $id) === false) {
            $this->brb->addError("fieldList", BPC::NOT_RELATED, null, $index, "id");
            return null;
        }

        $model->id = $id;
        return $model;
    }
}
