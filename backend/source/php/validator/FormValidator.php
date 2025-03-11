<?php

namespace mate\validator;

use mate\enumerator\BadParameterCode as BPC;
use mate\enumerator\Type;
use mate\error\BadRequestBuilder;
use mate\error\SchemaError;
use mate\model\FieldModel;
use mate\model\FormValueModel;
use mate\repository\FieldRepository;
use mate\repository\FormRepository;
use mate\repository\FormValueRepository;
use mate\repository\GroupRepository;
use mate\repository\TypeRepository;
use mate\repository\UnitRepository;
use WP_REST_Request;

class FormValidator extends Validator
{
    private readonly TypeValidator $typeValidator;
    private readonly FormValueRepository $formValueRepository;
    private readonly FieldRepository $fieldRepository;
    private readonly TypeRepository $typeRepository;
    private readonly UnitRepository $unitRepository;
    private readonly GroupRepository $groupRepository;

    public function __construct(BadRequestBuilder $brb)
    {
        parent::__construct(FormRepository::inject(), $brb);
        $this->formValueRepository = FormValueRepository::inject();
        $this->fieldRepository = FieldRepository::inject();
        $this->typeRepository = TypeRepository::inject();
        $this->unitRepository = UnitRepository::inject();
        $this->groupRepository = GroupRepository::inject();
        $this->typeValidator = new TypeValidator($brb);
    }

    public function valueList(mixed $valueList, mixed $formId = null, mixed $templateId = null): array|null
    {
        $parameterName = "valueList";

        if ($this->brb->hasError("id", "templateId")) {
            return null;
        }

        if ($valueList === null) {
            $this->brb->addError($parameterName, BPC::REQUIRED);
            return null;
        }

        $templateId = ($formId !== null) ? $this->repository->selectById($formId)->templateId : $templateId;

        if (mate_sanitize_array($valueList) === false) {
            $this->brb->addError($parameterName, BPC::INCORRECT, BPC::DATA_INCORRECT_ARRAY);
            return null;
        }

        $fieldValueMap = [];

        foreach ($valueList as $index => $value) {
            $this->valueDto($value, $index, $formId, $templateId, $fieldValueMap);
        }

        $this->requiredFields($templateId, $fieldValueMap);
        return $fieldValueMap;
    }

    private function valueDto(
        mixed $value,
        int $index,
        ?int $formId,
        int $templateId,
        array &$fieldValueMap
    ): void {
        $model = new FormValueModel();

        if (mate_sanitize_array($value) === false) {
            $this->brb->addError("valueList", BPC::INCORRECT, BPC::DATA_INCORRECT_ARRAY, $index);
            return;
        }

        $field = $this->dtoField($value, $index, $templateId);

        if ($field !== null) {
            $column = $this->typeRepository->selectById($field->typeId)->column;

            $model->id = $this->dtoId($value, $index, $formId, $field);
            $model->$column = $this->dtoValue($value, $index, $field);
            $model->unitValueId = $this->dtoUnit($value, $index, $field);
            $this->dtoNotMultiple($index, $field, $fieldValueMap);

            if (isset($fieldValueMap[$field->id]) === false) {
                $fieldValueMap[$field->id] = [
                    "field" => $field,
                    "values" => []
                ];
            }

            $fieldValueMap[$field->id]["values"][] = $model;
        }
    }

    private function dtoField(array $value, int $index, int $templateId): ?FieldModel
    {
        if (isset($value["fieldId"]) === false || $value["fieldId"] === null) {
            $this->brb->addError("valueList", BPC::REQUIRED, null, $index, "fieldId");
            return null;
        }

        if (($fieldId = mate_sanitize_int($value["fieldId"])) === false) {
            $this->brb->addError("valueList", BPC::INCORRECT, BPC::DATA_INCORRECT_INTEGER, $index, "fieldId");
            return null;
        }

        if (($field = $this->fieldRepository->selectById($fieldId)) === null) {
            $this->brb->addError("valueList", BPC::NOT_FOUND, null, $index, "fieldId");
            return null;
        }

        if ($field->templateId !== $templateId) {
            $this->brb->addError("valueList", BPC::NOT_RELATED, null, $index, "fieldId");
            return null;
        }

        return $field;
    }

    private function dtoId(array $value, int $index, ?int $formId, FieldModel $field): int
    {
        if (isset($value["id"]) === false || $value["id"] === null || $this->brb->hasError("id", "templateId")) {
            return 0;
        }

        if (($id = mate_sanitize_int($value["id"])) === false) {
            $this->brb->addError("valueList", BPC::INCORRECT, BPC::DATA_INCORRECT_INTEGER, $index, "id");
            return 0;
        }

        if (
            $formId === null
            || $this->repository->containsValueById($formId, $id) === false
            || (($formValue = $this->repository->selectById($id)) !== null
            && $field->id !== $formValue->fieldId)
        ) {
            $this->brb->addError("valueList", BPC::NOT_RELATED, null, $index, "id");
            return 0;
        }

        return $id;
    }

    private function dtoValue(array $value, int $index, FieldModel $field): mixed
    {
        if (isset($value["value"]) === false || $value["value"] === null) {
            $this->brb->addError("valueList", BPC::REQUIRED, null, $index, "value");
            return null;
        }

        if (is_string($value["value"]) && trim($value["value"]) === "") {
            return null;
        }

        return $this->typeValidator->MIXED($value["value"], $field->typeId, $index, "valueList", false, $field);
    }

    private function dtoUnit(array $value, int $index, FieldModel $field): ?int
    {
        if ($field->unitId === null) {
            return null;
        }

        if (isset($dto["unit"]) === false) {
            $this->brb->addError("valueList", BPC::REQUIRED, null, $index, "unitValueId");
            return null;
        }

        if (($unitValueId = mate_sanitize_int($dto["unit"])) === false) {
            $this->brb->addError("valueList", BPC::INCORRECT, BPC::DATA_INCORRECT_INTEGER, $index, "unitValueId");
            return null;
        }

        if ($this->unitRepository->containsValueById($field->unitId, $unitValueId) === false) {
            $this->brb->addError("valueList", BPC::NOT_RELATED, null, $index, "unitValueId");
            return null;
        }

        return $unitValueId;
    }

    private function dtoNotMultiple(int $index, FieldModel $field, array &$fieldValueMap): void
    {
        if (isset($fieldValueMap[$field->id])) {
            $type = $this->typeRepository->selectById($field->typeId);

            if ($type->allowMultipleValues === false) {
                $this->brb->addError("valueList", BPC::TYPE_NOT_MULTIPLE, null, $index, "fieldId");
            }
        }
    }

    private function requiredFields(int $templateId, array $fieldValueMap): void
    {
        if ($this->brb->hasError("id", "templateId", "valueList")) {
            return;
        }

        $fieldList = $this->fieldRepository->selectFieldListByTemplateId($templateId);
        $notNullMap = [];

        foreach ($fieldValueMap as $fieldValue) {
            $field = $fieldValue["field"];
            $values = $fieldValue["values"];
            $type = $this->typeRepository->selectById($field->typeId);
            $column = $type->column;

            foreach ($values as $value) {
                if (
                    $field->isRequired
                    && isset($value->$column)
                ) {
                    if ($column !== "text") {
                        $notNullMap[$field->id] = true;
                    }

                    if ($column === "text" && strlen(trim($value->$column)) > 0) {
                        $notNullMap[$field->id] = true;
                    }
                }
            }
        }

        foreach ($fieldList as $field) {
            if ($field->isRequired) {
                if (isset($notNullMap[$field->id]) === false) {
                    $this->brb->addError("valueList", BPC::REQUIRED, ["fieldId" => $field->id], null, "fieldId");
                }
            }
        }
    }
}
