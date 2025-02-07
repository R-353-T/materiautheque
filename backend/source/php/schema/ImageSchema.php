<?php

namespace mate\schema;

use mate\abstract\clazz\Schema;
use mate\error\WPErrorBuilder;
use mate\model\ImageModel;
use mate\validator\ImageValidator;
use WP_Error;
use WP_REST_Request;

class ImageSchema extends Schema
{
    private readonly ImageValidator $validator;

    public function __construct()
    {
        $this->validator = ImageValidator::inject();
    }

    public function create(WP_REST_Request $req, array $errors = [])
    {
        $name = $this->validator->validRequestName($req, $errors);
        $file = $this->validator->validRequestFile($_FILES, $errors);

        if (count($errors) > 0) {
            return WPErrorBuilder::badRequestError($errors);
        } else {
            $model = new ImageModel();
            $model->name = $name;
            $model->file = $file;
            return $model;
        }
    }

    public function update(WP_REST_Request $req, array $errors = [])
    {
        $id = $this->validator->validRequestId($req, $errors);
        $name = $this->validator->validRequestName($req, $errors);
        $file = $this->validator->validRequestFile($_FILES, $errors, ["required" => false]);

        if (count($errors) > 0) {
            return WPErrorBuilder::badRequestError($errors);
        } else {
            $model = new ImageModel();
            $model->id = $id;
            $model->name = $name;
            $model->file = $file;
            return $model;
        }
    }

    public function list(WP_REST_Request $req, array $errors = []): array|WP_Error
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
            $model = new ImageModel();
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
            $model = new ImageModel();
            $model->id = $id;
            return $model;
        }
    }
}
