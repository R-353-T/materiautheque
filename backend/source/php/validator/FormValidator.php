<?php

namespace mate\validator;

use mate\enumerator\BadParameterCode as BPC;
use mate\enumerator\Type;
use mate\error\BadRequestBuilder;
use mate\error\SchemaError;
use mate\model\FieldModel;
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
        if (mate_sanitize_array($value) === false) {
            $this->brb->addIndexedError("valueList", $index, BPC::INCORRECT, BPC::DATA_INCORRECT_ARRAY);
            return;
        }

        $field = $this->dtoField($value, $index, $templateId);

        if ($field !== null) {
            $id = $this->dtoId($value, $index, $formId, $field);
        }

        $this->validDtoValue($dto, $errors, $paramName, $options);
        $this->validDtoUnit($dto, $errors, $paramName, $options);
        $this->validDtoNotMultiple($dto, $errors, $paramName, $options);
    }

    private function dtoField(array $value, int $index, int $templateId): ?FieldModel
    {
        if (isset($value["fieldId"]) === false || $value["fieldId"] === null) {
            $this->brb->addIndexedError(
                "valueList",
                $index,
                BPC::REQUIRED,
                ["name" => "fieldId"]
            );
            return null;
        }

        if (($fieldId = mate_sanitize_int($value["fieldId"])) === false) {
            $this->brb->addIndexedError(
                "valueList",
                $index,
                BPC::INCORRECT,
                ["name" => "fieldId", "type" => "INTEGER"]
            );
            return null;
        }

        if (($field = $this->fieldRepository->selectById($fieldId)) === null) {
            $this->brb->addIndexedError(
                "valueList",
                $index,
                BPC::UNAVAILABLE,
                ["name" => "fieldId", "fieldId" => $fieldId]
            );
            return null;
        }

        if ($field->templateId !== $templateId) {
            $this->brb->addIndexedError(
                "valueList",
                $index,
                BPC::NOT_RELATED,
                ["name" => "fieldId", "fieldId" => $fieldId]
            );
            return null;
        }

        return $field;
    }

    private function dtoId(array $value, int $index, ?int $formId, FieldModel $field): ?int
    {
        if (isset($value["id"]) === false || $value["id"] === null || $this->brb->hasError("id", "templateId")) {
            return null;
        }

        if (($id = mate_sanitize_int($value["id"])) === false) {
            $this->brb->addIndexedError(
                "valueList",
                $index,
                BPC::INCORRECT,
                ["name" => "id", "type" => "INTEGER"]
            );
            return null;
        }

        if ($formId === null) {
            $this->brb->addIndexedError(
                "valueList",
                $index,
                BPC::NOT_RELATED,
                ["name" => "id"]
            );
            return null;
        }

        if ($this->repository->containsValueById($formId, $id) === false) {
            $this->brb->addIndexedError(
                "valueList",
                $index,
                BPC::NOT_RELATED,
                ["name" => "id", "id" => $id]
            );
            return null;
        }

        if (
            ($formValue = $this->repository->selectById($id)) !== null
            && $field->id !== $formValue->fieldId
        ) {
            $this->brb->addIndexedError(
                "valueList",
                $index,
                BPC::NOT_RELATED,
                [
                    "name" => "fieldId",
                    "fieldId" => $field->id
                ]
            );
            return null;
        }

        return $id;
    }

    private function validDtoValue(array $dto, array &$errors, string $paramName, array &$options): void
    {
        if (isset($dto["value"]) === false) {
            $err = SchemaError::required($paramName);
            $err["index"] = $options["index"];
            $err["property"] = "value";
            $errors[] = $err;
        } elseif ($this->hasError($errors, "fieldId") === false) {
            $field = $this->fieldRepository->selectById($options["model"]->fieldId);

            if ($dto["value"] !== null) {
                if (is_string($dto["value"]) && trim($dto["value"]) === "") {
                    $dto["value"] = null;
                } else {
                    $value = $this->typeValidator->validValue(
                        $field->typeId,
                        $dto["value"],
                        $paramName,
                        ["enumeratorId" => $field->enumeratorId]
                    );

                    if (is_array($value)) {
                        $value["index"] = $options["index"];
                        $value["property"] = "value";
                        $errors[] = $value;
                    } else {
                        $type = $this->typeRepository->selectById($field->typeId);
                        $column = $type->column;
                        $options["model"]->$column = $value;
                    }
                }
            }
        }
    }

    private function validDtoUnit($dto, $errors, $paramName, $options)
    {
        if ($this->hasError($errors, "fieldId") === false) {
            $field = $this->fieldRepository->selectById($options["model"]->fieldId);

            if ($field->unitId !== null) {
                if (isset($dto["unit"]) === false) {
                    $err = SchemaError::required($paramName);
                    $err["index"] = $options["index"];
                    $err["property"] = "unit";
                    $errors[] = $err;
                } elseif (mate_sanitize_int($dto["unit"]) === false) {
                    $err = SchemaError::incorrectType($paramName, "integer");
                    $err["index"] = $options["index"];
                    $err["property"] = "unit";
                    $errors[] = $err;
                } elseif ($this->unitRepository->containsValueById($field->unitId, $dto["unit"]) === false) {
                    $err = SchemaError::notForeignOf($paramName, $field->unitId);
                    $err["index"] = $options["index"];
                    $err["property"] = "unit";
                    $errors[] = $err;
                } else {
                    $options["model"]->unitValueId = $dto["unit"];
                }
            }
        }
    }

    private function validDtoNotMultiple(array $dto, array &$errors, string $paramName, array &$options): void
    {
        if ($this->hasError($errors, "fieldId") === false) {
            if (isset($options["fieldMap"][$options["model"]->fieldId]) === false) {
                $options["fieldMap"][$options["model"]->fieldId] = true;
            } else {
                $field = $this->fieldRepository->selectById($options["model"]->fieldId);
                $err = $this->typeValidator->typeIsMultiple($field->typeId, $paramName);

                if (is_array($err)) {
                    $err["index"] = $options["index"];
                    $err["property"] = "fieldId";
                    $errors[] = $err;
                }
            }
        }
    }

    private function validRequiredFields(
        WP_REST_Request $req,
        array &$errors,
        array &$valueList,
        string $paramName = "field"
    ): void {
        if ($this->hasError($errors, "id", "templateId", "valueList") === false) {
            $templateId = $req->get_param("templateId");

            /** @var FieldModel */
            $fieldList = $this->fieldRepository->selectFieldListByTemplateId($templateId);
            $nnValueMap = [];

            foreach ($valueList as $value) {
                /** @var FieldModel */
                $field = $this->fieldRepository->selectById($value->fieldId);

                if ($field->isRequired) {
                    $type = $this->typeRepository->selectById($field->typeId);
                    $column = $type->column;

                    if (isset($value->$column) && $value->$column !== null) {
                        $t = [Type::LABEL, Type::TEXT, Type::MONEY];

                        if (!in_array($field->typeId, $t) || strlen(trim($value->$column)) > 0) {
                            $nnValueMap[$field->id] = true;
                        }
                    }
                }
            }

            foreach ($fieldList as $field) {
                if ($field->isRequired) {
                    if (isset($nnValueMap[$field->id]) === false) {
                        $errors[] = SchemaError::formFieldRequired($paramName, $field->id, $field->groupId);
                    }
                }
            }
        }
    }
}
