<?php

namespace mate\validator;

use mate\abstract\clazz\Validator;
use mate\enumerator\Type;
use mate\error\SchemaError;
use mate\repository\FieldRepository;
use WP_REST_Request;

class FieldValidator extends Validator
{
    private readonly TypeValueValidator $typeValidator;

    public function __construct()
    {
        // $this->repository = FieldRepository::inject();
        // $this->typeValidator = TypeValueValidator::inject();
    }

    public function validTypeEnumerator(WP_REST_Request $req, array &$errors): bool
    {
        if ($this->hasError($errors, "typeId", "enumeratorId")) {
            return false;
        }

        $typeId = $req->get_param("typeId");
        $enumeratorId = $req->get_param("enumeratorId");

        if ($enumeratorId !== null && $typeId !== Type::ENUMERATOR) {
            // todo - remove custom error
            $errors[] = [
                "name" => "typeId",
                "code" => "param_field_malformed"
            ];
        }

        if ($typeId === Type::ENUMERATOR && $enumeratorId === null) {
            $errors[] = SchemaError::paramRequired("enumeratorId");
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
