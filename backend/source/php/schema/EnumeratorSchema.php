<?php

namespace mate\schema;

use mate\abstract\clazz\Schema;
use mate\error\WPErrorBuilder;
use mate\model\EnumeratorModel;
use mate\validator\EnumeratorValidator;
use WP_REST_Request;

class EnumeratorSchema extends Schema
{
    private readonly EnumeratorValidator $validator;

    public function __construct()
    {
        $this->validator = EnumeratorValidator::inject();
    }

    public function create(WP_REST_Request $req, array $errors = [])
    {
        $name = $this->validator->validRequestName($req, $errors);
        $description = $this->validator->validRequestDescription($req, $errors);
        $typeId = $this->validator->validRequestTypeId($req, $errors);
        $valueList = $this->validator->validRequestValueList($req, $errors);

        if (count($errors) > 0) {
            return WPErrorBuilder::badRequestError($errors);
        } else {
            $model = new EnumeratorModel();
            $model->name = $name;
            $model->description = $description;
            $model->typeId = $typeId;
            $model->valueList = $valueList;
            return $model;
        }
    }

    public function update(WP_REST_Request $req, array $errors = [])
    {
        $id = $this->validator->validRequestId($req, $errors);
        $name = $this->validator->validRequestName($req, $errors);
        $description = $this->validator->validRequestDescription($req, $errors);
        $typeId = $this->validator->validRequestTypeId($req, $errors);
        $valueList = $this->validator->validRequestValueList($req, $errors);

        if (count($errors) > 0) {
            return WPErrorBuilder::badRequestError($errors);
        } else {
            $model = new EnumeratorModel();
            $model->id = $id;
            $model->name = $name;
            $model->description = $description;
            $model->typeId = $typeId;
            $model->valueList = $valueList;
            return $model;
        }
    }

    public function list(WP_REST_Request $req, array $errors = [])
    {
        return $this->returnData(
            [
                "search" => $this->validator->validSearch($req),
                "index" => $this->validator->validPageIndex($req),
                "size" => $this->validator->validPageSize($req),
                "typeId" => $this->validator->validRequestTypeId($req, $errors, "typeId", ["required" => false])
            ],
            $errors
        );
    }


    public function get(WP_REST_Request $req, array $errors = [])
    {
        $id = $this->validator->validRequestId($req, $errors);

        if (count($errors) > 0) {
            return WPErrorBuilder::badRequestError($errors);
        } else {
            $model = new EnumeratorModel();
            $model->id = $id;
            return $model;
        }
    }

    public function delete(WP_REST_Request $req, array $errors = [])
    {
        $id = $this->validator->validRequestId($req, $errors);

        if (count($errors) > 0) {
            return WPErrorBuilder::badRequestError($errors);
        } else {
            $model = new EnumeratorModel();
            $model->id = $id;
            return $model;
        }
    }
}
