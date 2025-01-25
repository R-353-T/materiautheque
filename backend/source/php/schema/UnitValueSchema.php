<?php

namespace mate\schema;

use mate\abstract\clazz\Schema;
use mate\validator\UnitValueValidator;
use WP_Error;
use WP_REST_Request;

class UnitValueSchema extends Schema
{
    private readonly UnitValueValidator $validator;

    public function __construct()
    {
        $this->validator = UnitValueValidator::inject();
    }

    public function create(WP_REST_Request $req, array $errors = []): array|WP_Error
    {
        return $this->returnData(
            ["valueList" => $this->validator->validValueList($req, $errors)],
            $errors
        );
    }

    public function update(WP_REST_Request $req, array $errors = []): array|WP_Error
    {
        return $this->returnData(
            ["valueList" => $this->validator->validValueList($req, $errors)],
            $errors
        );
    }
}
