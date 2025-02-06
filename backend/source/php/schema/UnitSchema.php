<?php

namespace mate\schema;

use mate\abstract\clazz\Schema;
use mate\error\WPErrorBuilder;
use mate\model\UnitModel;
use mate\validator\UnitValidator;
use WP_Error;
use WP_REST_Request;

class UnitSchema extends Schema
{
    private readonly UnitValidator $validator;

    public function __construct()
    {
        $this->validator = UnitValidator::inject();
    }

    public function create(WP_REST_Request $req, array $errors = []): UnitModel|WP_Error
    {
        $name = $this->validator->validRequestName($req, $errors);
        $description = $this->validator->validRequestDescription($req, $errors);
        $valueList = $this->validator->validRequestValueList($req, $errors);

        if (count($errors) > 0) {
            return WPErrorBuilder::badRequestError($errors);
        } else {
            $model = new UnitModel();
            $model->name = $name;
            $model->description = $description;
            $model->valueList = $valueList;
            return $model;
        }
    }

    public function update(WP_REST_Request $req, array $errors = [])
    {
        $id = $this->validator->validRequestId($req, $errors);
        $name = $this->validator->validRequestName($req, $errors);
        $description = $this->validator->validRequestDescription($req, $errors);
        $valueList = $this->validator->validRequestValueList($req, $errors);

        if (count($errors) > 0) {
            return WPErrorBuilder::badRequestError($errors);
        } else {
            $model = new UnitModel();
            $model->id = $id;
            $model->name = $name;
            $model->description = $description;
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
                "size" => $this->validator->validPageSize($req)
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
            $model = new UnitModel();
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
            $model = new UnitModel();
            $model->id = $id;
            return $model;
        }
    }
}
