<?php

namespace mate\validator;

use mate\abstract\clazz\Validator;
use mate\error\SchemaError;
use mate\model\FormValueModel;
use mate\repository\FieldRepository;
use mate\repository\FormRepository;
use mate\repository\FormValueRepository;
use mate\repository\TypeRepository;
use mate\repository\UnitRepository;
use WP_REST_Request;

class FormValidator extends Validator
{
    private readonly TypeValidator $typeValidator;
    private readonly FieldValidator $fieldValidator;

    private readonly FormRepository $formRepository;
    private readonly FormValueRepository $formValueRepository;

    private readonly FieldRepository $fieldRepository;
    private readonly TypeRepository $typeRepository;
    private readonly UnitRepository $unitRepository;

    public function __construct()
    {
        $this->repository = FormRepository::inject();
        $this->formValueRepository = FormValueRepository::inject();

        $this->formRepository = FormRepository::inject();
        $this->typeValidator = TypeValidator::inject();
        $this->fieldValidator = FieldValidator::inject();

        $this->fieldRepository = FieldRepository::inject();
        $this->typeRepository = TypeRepository::inject();
        $this->unitRepository = UnitRepository::inject();
    }

    public function validRequestValueList(
        WP_REST_Request $req,
        array &$errors,
        string $paramName = "valueList"
    ): array|null {
        $valueList = [];

        if ($this->hasError($errors, "id", "templateId") === false) {
            $dtoList = $req->get_param($paramName);
            $formId = $req->get_param("id");
            $templateId = $formId !== null
            ? $this->formRepository->selectById($formId)->templateId
            : $req->get_param("templateId");

            if ($dtoList === null) {
                $errors[] = SchemaError::required($paramName);
            } elseif (mate_sanitize_array($valueList) === false) {
                $errors[] = SchemaError::incorrectType($paramName, "array");
            } else {
                foreach ($dtoList as $dtoIndex => $dto) {
                    $model = new FormValueModel();

                    $this->validDto(
                        $dto,
                        $errors,
                        $paramName,
                        [
                            "formId" => $formId,
                            "index" => $dtoIndex,
                            "templateId" => $templateId,
                            "model" => $model
                        ]
                    );

                    $valueList[$dtoIndex] = $model;
                }
            }
        }

        return $valueList;
    }

    private function validDto(
        mixed $dto,
        array &$errors,
        string $paramName,
        array &$options
    ): void {
        if (mate_sanitize_array($dto) === false) {
            $err = SchemaError::incorrectType($paramName, "array");
            $err["index"] = $options["index"];
            $errors[] = $err;
        } else {
            $this->validDtoFieldId($dto, $errors, $paramName, $options);
            $this->validDtoId($dto, $errors, $paramName, $options);
            $this->validDtoValue($dto, $errors, $paramName, $options);
            $this->validDtoUnit($dto, $errors, $paramName, $options);
        }
    }

    private function validDtoFieldId($dto, array &$errors, string $paramName, array &$options): void
    {
        $err = [];

        if (isset($dto["fieldId"]) === false || $dto["fieldId"] === null) {
            $err = SchemaError::required($paramName);
            $err["index"] = $options["index"];
            $err["property"] = "fieldId";
            $errors[] = $err;
        } elseif ($this->fieldValidator->validId($dto["fieldId"], $err, $paramName) === null) {
            $errors[] = $err[0];
        } else {
            $field = $this->fieldRepository->selectById($dto["fieldId"]);

            if ($field->templateId !== $options["templateId"]) {
                $err = SchemaError::templateFieldMissMatch($paramName);
                $err["index"] = $options["index"];
                $err["property"] = "fieldId";
                $errors[] = $err;
            } else {
                $options["model"]->fieldId = $dto["fieldId"];
            }
        }
    }

    private function validDtoId(array $dto, array &$errors, string $paramName, array &$options): void
    {
        if (isset($dto["id"]) !== false) {
            if ($options["formId"] === null) {
                $err = SchemaError::notForeignOf($paramName, "null");
                $err["index"] = $options["index"];
                $err["property"] = "id";
                $errors[] = $err;
            } elseif (mate_sanitize_int($dto["id"]) === false) {
                $err = SchemaError::incorrectType($paramName, "integer");
                $err["index"] = $options["index"];
                $err["property"] = "id";
                $errors[] = $err;
            } elseif ($this->formRepository->containsValueById($options["formId"], $dto["id"]) === false) {
                $err = SchemaError::notForeignOf($paramName, $options["formId"]);
                $err["index"] = $options["index"];
                $err["property"] = "id";
                $errors[] = $err;
            } else {
                if ($this->hasError($errors, "fieldId") === false) {
                    $value = $this->formValueRepository->selectById($dto["id"]);

                    if ($value->fieldId !== $options["model"]->fieldId) {
                        $err = SchemaError::templateFieldMissMatch($paramName);
                        $err["index"] = $options["index"];
                        $err["property"] = "id";
                        $errors[] = $err;
                    } else {
                        $options["model"]->id = $dto["id"];
                    }
                }
            }
        }
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
                $value = $this->typeValidator->validValue(
                    $field->typeId,
                    $dto["value"],
                    $paramName,
                    [ "enumeratorId" => $field->enumeratorId ]
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
}
