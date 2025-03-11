<?php

namespace mate\validator;

use mate\enumerator\BadParameterCode as BPC;
use mate\error\BadRequestBuilder;
use mate\model\UnitValueModel;
use mate\repository\UnitRepository;

class UnitValidator extends Validator
{
    private readonly TypeValidator $typeValidator;
    private const VL = "valueList";

    public function __construct(BadRequestBuilder $brb)
    {
        parent::__construct(UnitRepository::inject(), $brb);
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

    public function valueList(mixed $valueList, mixed $unitId = null): ?array
    {
        if ($this->brb->hasError("id")) {
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
            fn($index) => $this->valueDto($valueList[$index], $index, $unitId),
            array_keys($valueList)
        );
    }

    private function valueDto(mixed $value, int $index, ?int $unitId = null): ?UnitValueModel
    {
        $model = new UnitValueModel();
        $model->position = $index;

        if (mate_sanitize_array($value) === false) {
            $this->brb->addError(self::VL, BPC::INCORRECT, BPC::DATA_INCORRECT_ARRAY, $index);
            return null;
        }

        $this->dtoId($value, $unitId, $model);
        $this->dtoValue($value, $model);
        return $model;
    }

    private function dtoValue(array $dto, UnitValueModel $model): void
    {
        $model->value = "";

        if (isset($dto["value"]) === false) {
            $this->brb->addError(self::VL, BPC::REQUIRED, null, $model->position, "value");
            return;
        }

        if (($value = $this->typeValidator->LABEL($dto["value"], $model->position, self::VL, true)) !== null) {
            $model->value = $value;
        }
    }

    private function dtoId(array $dto, ?int $unitId = null, UnitValueModel $model): void
    {
        $model->id = null;

        if (isset($dto["id"]) === false || $dto["id"] === null) {
            return;
        }

        if ($unitId === null) {
            $this->brb->addError(self::VL, BPC::NOT_RELATED, null, $model->position, "id");
            return;
        }

        if (($id = mate_sanitize_int($dto["id"])) === false) {
            $this->brb->addError(self::VL, BPC::INCORRECT, BPC::DATA_INCORRECT_INTEGER, $model->position, "id");
            return;
        }

        if ($this->repository->containsValueById($unitId, $id) === false) {
            $this->brb->addError(self::VL, BPC::NOT_RELATED, null, $model->position, "id");
            return;
        }

        $model->id = $id;
    }
}
