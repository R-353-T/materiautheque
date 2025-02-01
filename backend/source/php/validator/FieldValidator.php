<?php

namespace mate\validator;

use mate\abstract\clazz\Validator;
use mate\error\SchemaError;
use mate\repository\FieldRepository;
use WP_REST_Request;

class FieldValidator extends Validator
{
    private readonly TypeValueValidator $typeValidator;

    public function __construct()
    {
        $this->repository = FieldRepository::inject();
        $this->typeValidator = TypeValueValidator::inject();
    }

    public function validDoubleValue(WP_REST_Request $req, array &$errors): bool
    {
        $typeId = $req->get_param("typeId");
        $enumeratorId = $req->get_param("enumeratorId");

        if ($typeId === null && $enumeratorId === null) {
            $errors[] = SchemaError::paramRequired("typeId");
            $errors[] = SchemaError::paramRequired("enumeratorId");
            return false;
        }

        if ($typeId !== null && $enumeratorId !== null) {
            // todo - remove custom error
            $errors[] = [
                "name" => "typeId",
                "code" => "param_double_value"
            ];
            // todo - remove custom error
            $errors[] = [
                "name" => "enumId",
                "code" => "param_double_value"
            ];
            return false;
        }

        return true;
    }

    public function validAllowMultipleValues(WP_REST_Request $req, array &$errors): bool
    {
        $allowMultipleValues = $req->get_param("allowMultipleValues");
        $allowMultipleValues = mate_sanitize_boolean($allowMultipleValues);

        if ($allowMultipleValues === null) {
            $errors[] = SchemaError::paramIncorrectType("allowMultipleValues", "boolean");
            return false;
        }

        if (!$this->hasError($errors, "typeId") && $allowMultipleValues === true) {
            $this->typeValidator->validTypeAllowMultipleValues($req, $errors, "typeId");
        }

        return $allowMultipleValues;
    }

    public function validIsRequired(WP_REST_Request $req, array &$errors): bool
    {
        $isRequired = $req->get_param("isRequired");
        $isRequired = mate_sanitize_boolean($isRequired);

        if ($isRequired === null) {
            $errors[] = SchemaError::paramIncorrectType("isRequired", "boolean");
            return false;
        }

        return $isRequired;
    }
}
