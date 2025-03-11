<?php

namespace mate\validator;

use mate\enumerator\BadParameterCode as BPC;
use mate\error\BadRequestBuilder;
use mate\model\EnumeratorValueModel;
use mate\repository\EnumeratorRepository;
use mate\repository\TypeRepository;

class EnumeratorValidator extends Validator
{
    private readonly TypeRepository $typeRepository;
    private readonly TypeValidator $typeValidator;
    private const VL = "valueList";

    public function __construct(BadRequestBuilder $brb)
    {
        parent::__construct(EnumeratorRepository::inject(), $brb);
        $this->typeRepository = TypeRepository::inject();
        $this->typeValidator = new TypeValidator($this->brb);
    }

    public function uName(mixed $name, ?int $unitId = null): string
    {
        $name = $this->name($name);

        if ($this->brb->hasError("name")) {
            return "";
        }

        if (($instance = $this->repository->selectByName($name)) !== null && $instance->id !== $unitId) {
            $this->brb->addError("name", BPC::UNAVAILABLE);
            return "";
        }

        return $name;
    }

    public function typeId(mixed $typeId): int
    {
        if ($typeId === null) {
            $this->brb->addError("typeId", BPC::REQUIRED);
            return 0;
        }

        if (($typeId = mate_sanitize_int($typeId)) === false) {
            $this->brb->addError("typeId", BPC::INCORRECT, BPC::DATA_INCORRECT_INTEGER);
            return 0;
        }

        if (($type = $this->typeRepository->selectById($typeId)) === null) {
            $this->brb->addError("typeId", BPC::NOT_FOUND);
            return 0;
        }

        if ($type->allowEnumeration === false) {
            $this->brb->addError("typeId", BPC::TYPE_NOT_ENUM);
            return 0;
        }

        return $typeId;
    }

    public function valueList(mixed $valueList, mixed $enumeratorId = null): ?array
    {
        if ($this->brb->hasError("id", "typeId")) {
            return null;
        }

        if ($valueList === null) {
            $this->brb->addError(self::VL, BPC::REQUIRED);
            return null;
        }

        if (mate_sanitize_array($valueList) === false) {
            $this->brb->addError(self::VL, BPC::INCORRECT, BPC::DATA_INCORRECT_ARRAY);
            return null;
        }

        return array_map(
            fn($index) => $this->valueDto($valueList[$index], $index, $enumeratorId),
            array_keys($valueList)
        );
    }

    private function valueDto(mixed $value, int $index, ?int $enumeratorId = null): ?EnumeratorValueModel
    {
        $model = new EnumeratorValueModel();
        $model->position = $index;

        if (mate_sanitize_array($value) === false) {
            $this->brb->addError("valueList", BPC::INCORRECT, BPC::DATA_INCORRECT_ARRAY, $index);
            return null;
        }

        $this->dtoId($value, $enumeratorId, $model);
        $this->dtoValue($value, $model);
        return $model;
    }

    private function dtoValue(array $dto, EnumeratorValueModel $model): void
    {
        if (isset($dto["value"]) === false) {
            $this->brb->addError(self::VL, BPC::REQUIRED, null, $model->position, "value");
            return;
        }

        if (($value = $this->typeValidator->MIXED($dto["value"], $dto["type"]->id, $model->position, self::VL))) {
            $column = $dto["type"]->column;
            $model->$column = $value;
        }
    }

    private function dtoId(array $dto, ?int $enumeratorId = null, EnumeratorValueModel $model): void
    {
        $model->id = null;

        if (isset($dto["id"]) === false || $dto["id"] === null) {
            return;
        }

        if ($enumeratorId === null) {
            $this->brb->addError(self::VL, BPC::NOT_RELATED, null, $model->position, "id");
        }

        if (($id = mate_sanitize_int($dto["id"])) === false) {
            $this->brb->addError(self::VL, BPC::INCORRECT, BPC::DATA_INCORRECT_INTEGER, $model->position, "id");
            return;
        }

        if ($this->repository->containsValueById($enumeratorId, $id) === false) {
            $this->brb->addError(self::VL, BPC::NOT_RELATED, null, $model->position, "id");
            return;
        }

        $model->id = $id;
    }
}
