<?php

namespace mate\schema;

use mate\abstract\clazz\Schema;
use mate\error\WPErrorBuilder;
use mate\model\FieldModel;
use mate\validator\EnumeratorValidator;
use mate\validator\FieldValidator;
use mate\validator\GroupValidator;
use mate\validator\TypeValidator;
use mate\validator\UnitValidator;
use WP_Error;
use WP_REST_Request;

class FieldSchema extends Schema
{
    private readonly FieldValidator $validator;
    private readonly GroupValidator $groupValidator;
    private readonly TypeValidator $typeValidator;
    private readonly EnumeratorValidator $enumeratorValidator;
    private readonly UnitValidator $unitValidator;

    public function __construct()
    {
        $this->validator = FieldValidator::inject();
        $this->groupValidator = GroupValidator::inject();
        $this->typeValidator = TypeValidator::inject();
        $this->enumeratorValidator = EnumeratorValidator::inject();
        $this->unitValidator = UnitValidator::inject();
    }

    public function create(WP_REST_Request $req, array $errors = []): FieldModel | WP_Error
    {
        $name = $this->validator->validRequestName($req, $errors);
        $description = $this->validator->validRequestDescription($req, $errors);
        $isRequired = $this->validator->validRequestIsRequired($req, $errors);
        $groupId = $this->groupValidator->validRequestId($req, $errors, "groupId");
        $typeId = $this->typeValidator->validRequestId($req, $errors, "typeId");

        $enumeratorId = $this->enumeratorValidator->validRequestId(
            $req,
            $errors,
            "enumeratorId",
            ["required" => false]
        );

        $unitId = $this->unitValidator->validRequestId($req, $errors, "unitId", ["required" => false]);
        $allowMultipleValues = $this->validator->validRequestAllowMultipleValues($req, $errors);

        $this->validator->validRequestAllowMultipleValues($req, $errors);
        $this->validator->validRequestTypeEnumerator($req, $errors);
        $this->validator->validRequestTypeWithUnit($req, $errors);

        if (count($errors) > 0) {
            return WPErrorBuilder::badRequestError($errors);
        } else {
            $model = new FieldModel();
            $model->name = $name;
            $model->description = $description;
            $model->isRequired = $isRequired;
            $model->groupId = $groupId;
            $model->typeId = $typeId;
            $model->enumeratorId = $enumeratorId;
            $model->unitId = $unitId;
            $model->allowMultipleValues = $allowMultipleValues;
            return $model;
        }
    }

    public function update(WP_REST_Request $req, array $errors = []): FieldModel | WP_Error
    {
        $id = $this->validator->validRequestId($req, $errors);
        $name = $this->validator->validRequestName($req, $errors);
        $description = $this->validator->validRequestDescription($req, $errors);
        $isRequired = $this->validator->validRequestIsRequired($req, $errors);
        $groupId = $this->groupValidator->validRequestId($req, $errors, "groupId");
        $typeId = $this->typeValidator->validRequestId($req, $errors, "typeId");

        $enumeratorId = $this->enumeratorValidator->validRequestId(
            $req,
            $errors,
            "enumeratorId",
            ["required" => false]
        );

        $unitId = $this->unitValidator->validRequestId($req, $errors, "unitId", ["required" => false]);
        $allowMultipleValues = $this->validator->validRequestAllowMultipleValues($req, $errors);

        $this->validator->validRequestAllowMultipleValues($req, $errors);
        $this->validator->validRequestTypeEnumerator($req, $errors);
        $this->validator->validRequestTypeWithUnit($req, $errors);

        if (count($errors) > 0) {
            return WPErrorBuilder::badRequestError($errors);
        } else {
            $model = new FieldModel();
            $model->id = $id;
            $model->name = $name;
            $model->description = $description;
            $model->isRequired = $isRequired;
            $model->groupId = $groupId;
            $model->typeId = $typeId;
            $model->enumeratorId = $enumeratorId;
            $model->unitId = $unitId;
            $model->allowMultipleValues = $allowMultipleValues;
            return $model;
        }
    }

    public function list(WP_REST_Request $req, array $errors = []): array | WP_Error
    {
        return $this->returnData(
            [
                "groupId" => $this->groupValidator->validRequestId($req, $errors, "groupId"),
                "search" => $this->validator->validSearch($req),
                "index" => $this->validator->validPageIndex($req),
                "size" => $this->validator->validPageSize($req)
            ],
            $errors
        );
    }

    public function get(WP_REST_Request $req, array $errors = []): FieldModel | WP_Error
    {
        $id = $this->validator->validRequestId($req, $errors);

        if (count($errors) > 0) {
            return WPErrorBuilder::badRequestError($errors);
        } else {
            $model = new FieldModel();
            $model->id = $id;
            return $model;
        }
    }

    public function delete(WP_REST_Request $req, array $errors = []): FieldModel | WP_Error
    {
        $id = $this->validator->validRequestId($req, $errors);

        if (count($errors) > 0) {
            return WPErrorBuilder::badRequestError($errors);
        } else {
            $model = new FieldModel();
            $model->id = $id;
            return $model;
        }
    }
}
