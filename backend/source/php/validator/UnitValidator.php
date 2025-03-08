<?php

namespace mate\validator;

use mate\enumerator\BadParameterCode as BPC;
use mate\error\BadRequestBuilder;
use mate\model\UnitValueModel;
use mate\repository\UnitRepository;

class UnitValidator extends Validator
{
    private readonly TypeValidator $typeValidator;

    public function __construct(BadRequestBuilder $brb)
    {
        parent::__construct(
            UnitRepository::inject(),
            $brb
        );

        $this->typeValidator = new TypeValidator($this->brb);
    }

    public function name(mixed $name, ?int $unitId = null): ?string
    {
        $parameterName = "name";

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

        if (($instance = $this->repository->selectByName($name)) !== null && $instance->id !== $unitId) {
            $this->brb->addError($parameterName, BPC::UNAVAILABLE);
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

    public function valueList(mixed $valueList, ?int $unitId = null): ?array
    {
        $parameterName = "valueList";

        if ($this->brb->hasError("id")) {
            return null;
        }

        if ($valueList === null) {
            $this->brb->addError($parameterName, BPC::REQUIRED);
            return null;
        }

        if (mate_sanitize_array($valueList) === false) {
            $this->brb->addError($parameterName, BPC::INCORRECT, BPC::DATA_INCORRECT_ARRAY);
            return null;
        }

        return array_map(
            fn($index) => $this->valueDto($valueList[$index], $index, $unitId),
            array_keys($valueList)
        );
    }

    private function valueDto(mixed $value, int $index, ?int $unitId = null): ?UnitValueModel
    {
        $model = new UnitValueModel();
        $model->position = $index;

        if (mate_sanitize_array($value) === false) {
            $this->brb->addIndexedError("valueList", $index, BPC::INCORRECT, BPC::DATA_INCORRECT_ARRAY);
            return null;
        }

        $this->dtoId($value, $unitId, $model);
        $this->dtoValue($value, $model);
        return $model;
    }

    private function dtoValue(array $dto, UnitValueModel $model): void
    {
        $model->value = "";
        $parameterName = "valueList";

        if (isset($dto["value"]) === false) {
            $this->brb->addIndexedError(
                $parameterName,
                $model->position,
                BPC::REQUIRED,
                ["name" => "value"]
            );
            return;
        }

        if (($value = $this->typeValidator->LABEL($dto["value"], $model->position, $parameterName, true)) !== null) {
            $model->value = $value;
        }
    }

    private function dtoId(array $dto, ?int $unitId = null, UnitValueModel $model): void
    {
        $model->id = null;
        $parameterName = "valueList";

        if (isset($dto["id"]) === false || $dto["id"] === null) {
            return;
        }

        if ($unitId === null) {
            $this->brb->addIndexedError(
                $parameterName,
                $model->position,
                BPC::REQUIRED,
                ["name" => "id"]
            );
            return;
        }

        if (($id = mate_sanitize_int($dto["id"])) === false) {
            $this->brb->addIndexedError(
                $parameterName,
                $model->position,
                BPC::INCORRECT,
                [
                    "name" => "id",
                    "type" => "INTEGER"
                ]
            );
            return;
        }

        if ($this->repository->containsValueById($unitId, $id) === false) {
            $this->brb->addIndexedError(
                $parameterName,
                $model->position,
                BPC::NOT_FOUND,
                ["name" => "id"]
            );
            return;
        }

        $model->id = $id;
    }
}
