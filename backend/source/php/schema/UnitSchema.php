<?php

namespace mate\schema;

use mate\abstract\clazz\Schema;
use mate\model\UnitModel;
use mate\validator\UnitValidator;
use mate\validator\UnitValueValidator;
use WP_Error;
use WP_REST_Request;

class UnitSchema extends Schema
{
    private readonly UnitValidator $validator;
    private readonly UnitValueValidator $valueValidator;

    public function __construct()
    {
        $this->validator = UnitValidator::inject();
        $this->valueValidator = UnitValueValidator::inject();
    }

    public function create(WP_REST_Request $req, array $errors = []): UnitModel|WP_Error
    {
        return $this->returnModel(
            [
                "name" => $this->validator->validName($req, $errors),
                "description" => $this->validator->validDescription($req, $errors),
                "valueList" => $this->valueValidator->validValueList($req, $errors)
            ],
            UnitModel::class,
            $errors
        );
    }

    public function update(WP_REST_Request $req, array $errors = []): UnitModel|WP_Error
    {
        return $this->returnModel(
            [
                "id" => $this->validator->validRequestId($req, $errors),
                "name" => $this->validator->validName($req, $errors),
                "description" => $this->validator->validDescription($req, $errors),
                "valueList" => $this->valueValidator->validValueList($req, $errors)
            ],
            UnitModel::class,
            $errors
        );
    }

    public function list(WP_REST_Request $req, array $errors = []): array|WP_Error
    {
        return $this->returnData(
            [
                "search" => $this->validator->validSearch($req),
                "pageIndex" => $this->validator->validPageIndex($req),
                "pageSize" => $this->validator->validPageSize($req)
            ],
            $errors
        );
    }

    public function get(WP_REST_Request $req, array $errors = []): UnitModel|WP_Error
    {
        return $this->returnModel(
            ["id" => $this->validator->validRequestId($req, $errors)],
            UnitModel::class,
            $errors
        );
    }

    public function delete(WP_REST_Request $req, array $errors = []): UnitModel|WP_Error
    {
        return $this->returnModel(
            ["id" => $this->validator->validRequestId($req, $errors)],
            UnitModel::class,
            $errors
        );
    }
}
