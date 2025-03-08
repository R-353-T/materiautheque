<?php

namespace mate\validator;

use mate\abstract\clazz\Validator;
use mate\enumerator\Type;
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
    private readonly FieldValidator $fieldValidator;

    private readonly FormRepository $formRepository;
    private readonly FormValueRepository $formValueRepository;

    private readonly FieldRepository $fieldRepository;
    private readonly TypeRepository $typeRepository;
    private readonly UnitRepository $unitRepository;
    private readonly GroupRepository $groupRepository;

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
        $this->groupRepository = GroupRepository::inject();
    }


    /**
     * @return FormValueModel[]|null
     */
    public function validRequestValueList(
        WP_REST_Request $req,
        array &$errors,
        string $paramName = "valueList"
    ): array|null {
        $formId = $req->get_param("id");
        $dtoList = $req->get_param($paramName);

        /** @var FormValueModel[] */
        $output = [];

        if ($this->hasError($errors, "id", "templateId") === false) {
            if ($formId !== null) {
                $templateId = $this->formRepository->selectById($formId)->templateId;
            } else {
                $templateId = $req->get_param("templateId");
            }

            if ($dtoList === null) {
                $errors[] = SchemaError::required($paramName);
            } elseif (mate_sanitize_array($dtoList) === false) {
                $errors[] = SchemaError::incorrectType($paramName, "array");
            } else {
                $fieldMap = [];

                foreach ($dtoList as $dtoIndex => $dto) {
                    $model = new FormValueModel();

                    $options = [
                        "formId" => $formId,
                        "index" => $dtoIndex,
                        "templateId" => $templateId,
                        "model" => $model,
                        "fieldMap" => $fieldMap
                    ];

                    $this->validDto(
                        $dto,
                        $errors,
                        $paramName,
                        $options
                    );

                    $output[$dtoIndex] = $model;
                }

                $this->validRequiredFields($req, $errors, $output);
            }
        }

        return $output;
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
            $this->validDtoNotMultiple($dto, $errors, $paramName, $options);
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
            /** @var FieldModel */
            $field = $this->fieldRepository->selectById($dto["fieldId"]);
            $group = $this->groupRepository->selectById($field->groupId);

            if ($group->templateId !== $options["templateId"]) {
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
                if (is_string($dto["value"]) && trim($dto["value"]) === "") {
                    $dto["value"] = null;
                } else {
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
