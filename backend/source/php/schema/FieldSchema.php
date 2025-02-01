<?php

namespace mate\schema;

use mate\abstract\clazz\Schema;
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
        $this->validator->validDoubleValue($req, $errors);

        return $this->returnModel(
            [
                "name" => $this->validator->validName($req, $errors),
                "description" => $this->validator->validDescription($req, $errors),
                "isRequired" => $this->validator->validIsRequired($req, $errors),
                "groupId" => $this->groupValidator->validId($req, $errors, "groupId"),
                "typeId" => $this->typeValidator->validId($req, $errors, "typeId", false),
                "enumeratorId" => $this->enumeratorValidator->validId($req, $errors, "enumeratorId", false),
                "unitId" => $this->unitValidator->validId($req, $errors, "unitId", false),
                "allowMultipleValues" => $this->validator->validAllowMultipleValues($req, $errors),
            ],
            FieldModel::class,
            $errors
        );
    }

    public function update(WP_REST_Request $req, array $errors = []): FieldModel | WP_Error
    {
        $this->validator->validDoubleValue($req, $errors);

        return $this->returnModel(
            [
                "id" => $this->validator->validId($req, $errors),
                "name" => $this->validator->validName($req, $errors),
                "description" => $this->validator->validDescription($req, $errors),
                "isRequired" => $this->validator->validIsRequired($req, $errors),
                "groupId" => $this->groupValidator->validId($req, $errors, "groupId"),
                "typeId" => $this->typeValidator->validId($req, $errors, "typeId", false),
                "enumeratorId" => $this->enumeratorValidator->validId($req, $errors, "enumeratorId", false),
                "unitId" => $this->unitValidator->validId($req, $errors, "unitId", false),
                "allowMultipleValues" => $this->validator->validAllowMultipleValues($req, $errors),
            ],
            FieldModel::class,
            $errors
        );
    }

    public function list(WP_REST_Request $req, array $errors = []): array | WP_Error
    {
        return $this->returnData(
            [
                "groupId" => $this->groupValidator->validId($req, $errors, "groupId"),
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
            ["id" => $this->validator->validId($req, $errors)],
            FieldModel::class,
            $errors
        );
    }

    public function delete(WP_REST_Request $req, array $errors = []): FieldModel | WP_Error
    {
        return $this->returnModel(
            ["id" => $this->validator->validId($req, $errors)],
            FieldModel::class,
            $errors
        );
    }
}
