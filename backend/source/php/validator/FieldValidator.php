<?php

namespace mate\validator;

use mate\enumerator\BadParameterCode as BPC;
use mate\enumerator\Type;
use mate\error\BadRequestBuilder;
use mate\repository\FieldRepository;
use mate\repository\TypeRepository;

class FieldValidator extends Validator
{
    private readonly TypeValidator $typeValidator;
    private readonly TypeRepository $typeRepository;

    public function __construct(BadRequestBuilder $brb)
    {
        parent::__construct(FieldRepository::inject(), $brb);
        $this->typeValidator = new TypeValidator($this->brb);
        $this->typeRepository = TypeRepository::inject();
    }

    public function name(mixed $name): ?string
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

    public function isRequired(mixed $isRequired): bool|null
    {
        if (($isRequired = mate_sanitize_boolean($isRequired)) === null) {
            $this->brb->addError("isRequired", BPC::INCORRECT, BPC::DATA_INCORRECT_BOOLEAN);
        }

        return $isRequired;
    }

    public function allowMultipleValues(mixed $allowMultipleValues, mixed $typeId): bool|null
    {
        if ($this->brb->hasError("typeId")) {
            return null;
        }

        if (($allowMultipleValues = mate_sanitize_boolean($allowMultipleValues)) === null) {
            $this->brb->addError("allowMultipleValues", BPC::INCORRECT, BPC::DATA_INCORRECT_BOOLEAN);
            return null;
        }

        if (
            ($type = $this->typeRepository->selectById($typeId)) !== null
            && $allowMultipleValues === true
            && $type->allowMultipleValues === false
        ) {
            $this->brb->addError("typeId", BPC::TYPE_NOT_MULTIPLE);
            return null;
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
        }

        if ($typeId !== Type::ENUMERATOR && $enumeratorId !== null) {
            $this->brb->addError("typeId", BPC::INCORRECT);
            $this->brb->addError("enumeratorId", BPC::INCORRECT);
        }
    }

    public function typeWithUnit(mixed $typeId, mixed $unitId): void
    {
        if ($this->brb->hasError("typeId", "unitId")) {
            return;
        }

        if ($unitId !== null && Type::allowUnit($typeId) === false) {
            $this->brb->addError("typeId", BPC::TYPE_NOT_UNIT);
        }
    }
}
