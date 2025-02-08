<?php

namespace mate\validator;

use mate\abstract\clazz\Validator;
use mate\enumerator\Type;
use mate\error\SchemaError;
use mate\repository\FieldRepository;
use WP_REST_Request;

class FieldValidator extends Validator
{
    private readonly TypeValidator $typeValidator;
    private readonly FieldRepository $fieldRepository;

    public function __construct()
    {
        $this->repository = FieldRepository::inject();
        $this->fieldRepository = FieldRepository::inject();
        $this->typeValidator = TypeValueValidator::inject();
    }

    public function validRequestTypeEnumerator(
        WP_REST_Request $req,
        array &$errors,
        string $paramName = "typeId"
    ): bool|null {
        $output = null;

        if ($this->hasError($errors, $paramName, "enumeratorId") === false) {
            $typeId = $req->get_param($paramName);
            $enumeratorId = $req->get_param("enumeratorId");

            if ($typeId === Type::ENUMERATOR && $enumeratorId === null) {
                $errors[] = SchemaError::required("enumeratorId");
            } elseif ($typeId !== Type::ENUMERATOR && $enumeratorId !== null) {
                $errors[] = SchemaError::incorrectType("enumeratorId", "null");
            } else {
                $output = true;
            }
        }

        return $output;
    }

    public function validRequestTypeWithUnit(
        WP_REST_Request $req,
        array &$errors,
        string $paramName = "typeId"
    ): bool|null {
        $output = false;

        if ($this->hasError($errors, $paramName, "unitId") === false) {
            $typeId = $req->get_param($paramName);
            $unitId = $req->get_param("unitId");

            if ($unitId !== null) {
                $typeId = $this->typeValidator->typeIsUnitable($typeId, "typeId");

                if (is_array($typeId)) {
                    $errors[] = $typeId;
                    $unitId = null;
                } else {
                    $output = true;
                }
            }
        }

        return $output;
    }

    public function validRequestAllowMultipleValues(WP_REST_Request $req, array &$errors): bool|null
    {
        $allowMultipleValues = $req->get_param("allowMultipleValues");
        $allowMultipleValues = mate_sanitize_boolean($allowMultipleValues);

        if ($this->hasError($errors, "typeId") === false) {
            if ($allowMultipleValues === null) {
                $errors[] = SchemaError::incorrectType("allowMultipleValues", "boolean");
                $allowMultipleValues = null;
            } elseif ($allowMultipleValues === true) {
                $typeId = $this->typeValidator->typeIsMultiple($allowMultipleValues, "typeId");

                if (is_array($typeId)) {
                    $errors[] = $typeId;
                    $allowMultipleValues = null;
                }
            }
        }

        return $allowMultipleValues;
    }

    public function validRequestIsRequired(
        WP_REST_Request $req,
        array &$errors,
        string $paramName = "isRequired"
    ): bool|null {
        $isRequired = $req->get_param($paramName);
        $isRequired = mate_sanitize_boolean($isRequired);

        if ($isRequired === null) {
            $errors[] = SchemaError::incorrectType("isRequired", "boolean");
            $isRequired = null;
        }

        return $isRequired;
    }
}
