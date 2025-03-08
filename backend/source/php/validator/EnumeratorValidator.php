<?php

namespace mate\validator;

use mate\enumerator\BadParameterCode as BPC;
use mate\error\BadRequestBuilder;
use mate\error\SchemaError;
use mate\model\EnumeratorValueModel;
use mate\repository\EnumeratorRepository;
use mate\repository\TypeRepository;

class EnumeratorValidator extends Validator
{
    private readonly TypeRepository $typeRepository;
    private readonly TypeValidator $typeValidator;

    public function __construct(BadRequestBuilder $brb)
    {
        parent::__construct(
            EnumeratorRepository::inject(),
            $brb
        );

        $this->typeRepository = TypeRepository::inject();
        $this->typeValidator = new TypeValidator($this->brb);
    }

    public function name(string $name, ?int $enumeratorId = null): string|null
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

        if (($instance = $this->repository->selectByName($name)) !== null && $instance->id !== $enumeratorId) {
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

    public function typeId(
        mixed $typeId,
        bool $required = true,
    ): ?int {
        $parameterName = "typeId";

        if ($typeId === null && $required === true) {
            $this->brb->addError($parameterName, BPC::REQUIRED);
            return null;
        }

        if ($typeId !== null) {
            if (($typeId = mate_sanitize_int($typeId)) === false) {
                $this->brb->addError($parameterName, BPC::INCORRECT, BPC::DATA_INCORRECT_INTEGER);
                return null;
            }

            if (($type = $this->typeRepository->selectById($typeId)) === null) {
                $this->brb->addError($parameterName, BPC::NOT_FOUND);
                return null;
            }

            if ($type->allowEnumeration === false) {
                $this->brb->addError($parameterName, BPC::TYPE_NOT_ENUM);
                return null;
            }
        }

        return $typeId;
    }

    public function valueList(mixed $valueList, ?int $enumeratorId = null): ?array
    {
        $parameterName = "valueList";

        if ($this->brb->hasError("id", "typeId")) {
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
            fn($index) => $this->valueDto($valueList[$index], $index, $enumeratorId),
            array_keys($valueList)
        );
    }

    private function valueDto(mixed $value, int $index, ?int $unitId = null): ?EnumeratorValueModel
    {
        $model = new EnumeratorValueModel();
        $model->position = $index;

        if (mate_sanitize_array($value) === false) {
            $this->brb->addIndexedError("valueList", $index, BPC::INCORRECT, BPC::DATA_INCORRECT_ARRAY);
            return null;
        }

        $this->dtoId($value, $unitId, $model);
        $this->dtoValue($value, $model);
        return $model;
    }

    private function dtoId(array $dto, ?int $unitId = null, EnumeratorValueModel $model): void
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

    private function dtoValue(array $dto, EnumeratorValueModel $model): void
    {
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

        if (($value = $this->typeValidator->MIXED($dto["value"], $dto["type"]->id, $model->position, $parameterName))) {
            $column = $dto["type"]->column;
            $model->$column = $value;
        }
    }
}
