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

    public function name(mixed $name, string $parameterName = "name"): ?string
    {
        if ($name === null) {
            $this->brb->addError($parameterName, BPC::REQUIRED);
            return null;
        }

        if (($name = mate_sanitize_string($name)) === false) {
            $this->brb->addError($parameterName, BPC::INCORRECT, BPC::DATA_INCORRECT_STRING);
            return null;
        }

        if (strlen($name) === 0) {
            $this->brb->addError($parameterName, BPC::REQUIRED);
            return null;
        }

        if (strlen($name) > MATE_THEME_API_MAX_NAME_LENGTH) {
            $this->brb->addError($parameterName, BPC::STRING_MAX, BPC::DATA_STRING_MAX_NAME);
            return null;
        }

        return $name;
    }

    public function description(mixed $description): ?string
    {
        $parameterName = "description";

        if ($description === null) {
            $this->brb->addError($parameterName, BPC::REQUIRED);
            return null;
        }

        if (($description = mate_sanitize_string($description)) === false) {
            $this->brb->addError($parameterName, BPC::INCORRECT, BPC::DATA_INCORRECT_STRING);
            return null;
        }

        if (strlen($description) > MATE_THEME_API_MAX_DESCRIPTION_LENGTH) {
            $this->brb->addError($parameterName, BPC::STRING_MAX, BPC::DATA_STRING_MAX_DESCRIPTION);
            return null;
        }

        return $description;
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
            $this->brb->addIndexedError("groupList", $index, BPC::INCORRECT, BPC::DATA_INCORRECT_ARRAY);
            return null;
        }

        if (isset($dto["id"]) === false || $dto["id"] === null) {
            $this->brb->addIndexedError("groupList", $index, BPC::REQUIRED, ["name" => "id"]);
            return null;
        }

        if (($id = mate_sanitize_int($dto["id"])) === false) {
            $this->brb->addIndexedError("groupList", $index, BPC::INCORRECT, ["name" => "id", "type" => "INTEGER"]);
            return null;
        }

        if ($this->repository->containsGroupId($parentId, $id) === false) {
            $this->brb->addIndexedError("groupList", $index, BPC::NOT_RELATED, ["name" => "id"]);
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
            $this->brb->addIndexedError("fieldList", $index, BPC::INCORRECT, BPC::DATA_INCORRECT_ARRAY);
            return null;
        }

        if (isset($dto["id"]) === false || $dto["id"] === null) {
            $this->brb->addIndexedError("fieldList", $index, BPC::REQUIRED, ["name" => "id"]);
        }

        if (($id = mate_sanitize_int($dto["id"])) === false) {
            $this->brb->addIndexedError("fieldList", $index, BPC::INCORRECT, ["name" => "id", "type" => "INTEGER"]);
            return null;
        }

        if ($this->repository->containsFieldId($groupId, $id) === false) {
            $this->brb->addIndexedError("fieldList", $index, BPC::NOT_RELATED, ["name" => "id"]);
            return null;
        }

        $model->id = $id;
        return $model;
    }
}
