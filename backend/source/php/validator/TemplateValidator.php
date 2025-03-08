<?php

namespace mate\validator;

use mate\enumerator\BadParameterCode as BPC;
use mate\error\BadRequestBuilder;
use mate\model\GroupModel;
use mate\repository\TemplateRepository;

class TemplateValidator extends Validator
{
    public function __construct(BadRequestBuilder $brb)
    {
        parent::__construct(TemplateRepository::inject(), $brb);
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
}
