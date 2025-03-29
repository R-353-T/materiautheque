<?php

namespace mate\validator;

use mate\enumerator\BadParameterCode as BPC;
use mate\enumerator\Type;
use mate\error\BadRequestBuilder;
use mate\repository\FieldRepository;
use mate\repository\TypeRepository;

class FieldValidator extends Validator
{
    private readonly TypeRepository $typeRepository;

    public function __construct(BadRequestBuilder $brb)
    {
        parent::__construct(FieldRepository::inject(), $brb);
        $this->typeRepository = TypeRepository::inject();
    }

    public function isRequired(mixed $isRequired): bool
    {
        if (($isRequired = mate_sanitize_boolean($isRequired)) === null) {
            $this->brb->addError("isRequired", BPC::INCORRECT, BPC::DATA_INCORRECT_BOOLEAN);
            return false;
        }

        return $isRequired;
    }

    public function allowMultipleValues(mixed $allowMultipleValues, mixed $typeId): bool
    {
        if ($this->brb->hasError("typeId")) {
            return false;
        }

        if (($allowMultipleValues = mate_sanitize_boolean($allowMultipleValues)) === null) {
            $this->brb->addError("allowMultipleValues", BPC::INCORRECT, BPC::DATA_INCORRECT_BOOLEAN);
            return false;
        }

        if (
            ($type = $this->typeRepository->selectById($typeId)) !== null
            && $allowMultipleValues === true
            && $type->allowMultipleValues === false
        ) {
            $this->brb->addError("typeId", BPC::TYPE_NOT_MULTIPLE);
            return false;
        }

        return $allowMultipleValues;
    }

    public function typeWithEnumerator(mixed $typeId, mixed $enumeratorId): void
    {
        if ($this->brb->hasError("typeId", "enumeratorId")) {
            return;
        }

        if ($typeId === Type::ENUMERATOR && $enumeratorId === null) {
            $this->brb->addError("enumeratorId", BPC::REQUIRED);
            return;
        }

        if ($typeId !== Type::ENUMERATOR && $enumeratorId !== null) {
            $this->brb->addError("typeId", BPC::REQUIRED);
            $this->brb->addError("enumeratorId", BPC::REQUIRED);
            return;
        }
    }

    public function typeWithUnit(mixed $typeId, mixed $unitId): void
    {
        if ($this->brb->hasError("typeId", "unitId")) {
            return;
        }

        if ($unitId !== null && Type::allowUnit($typeId) === false) {
            $this->brb->addError("typeId", BPC::TYPE_NOT_UNIT);
            return;
        }
    }
}
