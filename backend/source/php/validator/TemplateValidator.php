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

    public function groupList(mixed $groupList, mixed $id): ?array
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
}
