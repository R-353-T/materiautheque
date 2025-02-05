<?php

namespace mate\schema;

use mate\abstract\clazz\Schema;
use mate\model\EnumeratorModel;
use mate\validator\EnumeratorValidator;
use mate\validator\EnumeratorValueValidator;
use mate\validator\TypeValueValidator;
use WP_Error;
use WP_REST_Request;

class EnumeratorSchema extends Schema
{
    private readonly EnumeratorValidator $validator;
    private readonly EnumeratorValueValidator $valueValidator;
    private readonly TypeValueValidator $typeValidator;

    public function __construct()
    {
        $this->validator = EnumeratorValidator::inject();
        $this->valueValidator = EnumeratorValueValidator::inject();
        $this->typeValidator = TypeValueValidator::inject();
    }

    public function create(WP_REST_Request $req, array $errors = []): EnumeratorModel|WP_Error
    {
        return $this->returnModel(
            [
                "name" => $this->validator->validName($req, $errors),
                "description" => $this->validator->validDescription($req, $errors),
                "typeId" => $this->typeValidator->validTypeEnumeration($req, $errors, "typeId"),
                "valueList" => $this->valueValidator->validValueList($req, $errors)
            ],
            EnumeratorModel::class,
            $errors
        );
    }

    public function update(WP_REST_Request $req, array $errors = []): EnumeratorModel|WP_Error
    {
        return $this->returnModel(
            [
                "id" => $this->validator->validRequestId($req, $errors),
                "name" => $this->validator->validName($req, $errors),
                "typeId" => $this->typeValidator->validTypeEnumeration($req, $errors, "typeId"),
                "description" => $this->validator->validDescription($req, $errors),
                "valueList" => $this->valueValidator->validValueList($req, $errors)
            ],
            EnumeratorModel::class,
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

    public function get(WP_REST_Request $req, array $errors = []): EnumeratorModel|WP_Error
    {
        return $this->returnModel(
            ["id" => $this->validator->validRequestId($req, $errors)],
            EnumeratorModel::class,
            $errors
        );
    }

    public function delete(WP_REST_Request $req, array $errors = []): EnumeratorModel|WP_Error
    {
        return $this->returnModel(
            ["id" => $this->validator->validRequestId($req, $errors)],
            EnumeratorModel::class,
            $errors
        );
    }
}
