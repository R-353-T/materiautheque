<?php

namespace mate\schema;

use mate\abstract\clazz\Schema;
use mate\error\WPErrorBuilder;
use mate\model\FieldModel;
use mate\validator\EnumeratorValidator;
use mate\validator\FieldValidator;
use mate\validator\GroupValidator;
use mate\validator\TypeValueValidator;
use mate\validator\UnitValidator;
use WP_Error;
use WP_REST_Request;

class FieldSchema extends Schema
{
    private readonly FieldValidator $validator;
    private readonly GroupValidator $groupValidator;
    private readonly TypeValueValidator $typeValidator;
    private readonly EnumeratorValidator $enumeratorValidator;
    private readonly UnitValidator $unitValidator;

    public function __construct()
    {
        $this->validator = FieldValidator::inject();
        $this->groupValidator = GroupValidator::inject();
        $this->typeValidator = TypeValueValidator::inject();
        $this->enumeratorValidator = EnumeratorValidator::inject();
        $this->unitValidator = UnitValidator::inject();
    }

    public function create(WP_REST_Request $req, array $errors = []): FieldModel | WP_Error
    {
        $model = $this->returnModel(
            [
                "name" => $this->validator->validName($req, $errors),
                "description" => $this->validator->validDescription($req, $errors),
                "isRequired" => $this->validator->validIsRequired($req, $errors),
                "groupId" => $this->groupValidator->validRequestId($req, $errors, "groupId"),
                "typeId" => $this->typeValidator->validRequestId($req, $errors, "typeId"),
                "enumeratorId" => $this->enumeratorValidator->validRequestId($req, $errors, "enumeratorId", false),
                "unitId" => $this->unitValidator->validRequestId($req, $errors, "unitId", false),
                "allowMultipleValues" => $this->validator->validAllowMultipleValues($req, $errors),
            ],
            FieldModel::class,
            $errors
        );

        if (count($errors) > 0) {
            return WPErrorBuilder::badRequestError($errors);
        } else {
            return $model;
        }
    }

    public function update(WP_REST_Request $req, array $errors = []): FieldModel | WP_Error
    {
        $model = $this->returnModel(
            [
                "id" => $this->validator->validRequestId($req, $errors),
                "name" => $this->validator->validName($req, $errors),
                "description" => $this->validator->validDescription($req, $errors),
                "isRequired" => $this->validator->validIsRequired($req, $errors),
                "groupId" => $this->groupValidator->validRequestId($req, $errors, "groupId"),
                "typeId" => $this->typeValidator->validRequestId($req, $errors, "typeId"),
                "enumeratorId" => $this->enumeratorValidator->validRequestId($req, $errors, "enumeratorId", false),
                "unitId" => $this->unitValidator->validRequestId($req, $errors, "unitId", false),
                "allowMultipleValues" => $this->validator->validAllowMultipleValues($req, $errors),
            ],
            FieldModel::class,
            $errors
        );

        $this->validator->validTypeEnumerator($req, $errors);

        if (count($errors) > 0) {
            return WPErrorBuilder::badRequestError($errors);
        } else {
            return $model;
        }
    }

    public function list(WP_REST_Request $req, array $errors = []): array | WP_Error
    {
        return $this->returnData(
            [
                "groupId" => $this->groupValidator->validRequestId($req, $errors, "groupId"),
                "search" => $this->validator->validSearch($req),
                "pageIndex" => $this->validator->validPageIndex($req),
                "pageSize" => $this->validator->validPageSize($req)
            ],
            $errors
        );
    }

    public function get(WP_REST_Request $req, array $errors = []): FieldModel | WP_Error
    {
        return $this->returnModel(
            ["id" => $this->validator->validRequestId($req, $errors)],
            FieldModel::class,
            $errors
        );
    }

    public function delete(WP_REST_Request $req, array $errors = []): FieldModel | WP_Error
    {
        return $this->returnModel(
            ["id" => $this->validator->validRequestId($req, $errors)],
            FieldModel::class,
            $errors
        );
    }
}
