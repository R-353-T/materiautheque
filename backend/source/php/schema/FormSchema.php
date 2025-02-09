<?php

namespace mate\schema;

use mate\abstract\clazz\Schema;
use mate\error\WPErrorBuilder;
use mate\model\FormModel;
use mate\validator\FormValidator;
use mate\validator\TemplateValidator;
use WP_Error;
use WP_REST_Request;

class FormSchema extends Schema
{
    private readonly FormValidator $validator;
    private readonly TemplateValidator $templateValidator;

    public function __construct()
    {
        $this->validator = FormValidator::inject();
        $this->templateValidator = TemplateValidator::inject();
    }

    public function create(WP_REST_Request $req, array $errors = []): array|WP_Error
    {
        $name = $this->validator->validRequestName($req, $errors);
        $templateId = $this->templateValidator->validRequestId($req, $errors, "templateId");
        $valueList = $this->validator->validRequestValueList($req, $errors);

        if (count($errors) > 0) {
            return WPErrorBuilder::badRequestError($errors);
        } else {
            $model = new FormModel();
            $model->name = $name;
            $model->templateId = $templateId;
            $model->valueList = $valueList;
            return $model;
        }
    }

    public function update(WP_REST_Request $req, array $errors = []): array|WP_Error
    {
        $id = $this->validator->validRequestId($req, $errors);
        $name = $this->validator->validRequestName($req, $errors);
        $valueList = $this->validator->validRequestValueList($req, $errors);

        if (count($errors) > 0) {
            return WPErrorBuilder::badRequestError($errors);
        } else {
            $model = new FormModel();
            $model->id = $id;
            $model->name = $name;
            $model->valueList = $valueList;
            return $model;
        }
    }

    public function list(WP_REST_Request $req, array $errors = []): array|WP_Error
    {
        return $this->returnData(
            [
                "templateId" => $this->templateValidator->validRequestId($req, $errors, "templateId"),
                "search" => $this->validator->validSearch($req),
                "index" => $this->validator->validPageIndex($req),
                "size" => $this->validator->validPageSize($req)
            ],
            $errors
        );
    }

    public function get(WP_REST_Request $req, array $errors = []): FormModel|WP_Error
    {
        $id = $this->validator->validRequestId($req, $errors);

        if (count($errors) > 0) {
            return WPErrorBuilder::badRequestError($errors);
        } else {
            $model = new FormModel();
            $model->id = $id;
            return $model;
        }
    }

    public function delete(WP_REST_Request $req, array $errors = []): FormModel|WP_Error
    {
        $id = $this->validator->validRequestId($req, $errors);

        if (count($errors) > 0) {
            return WPErrorBuilder::badRequestError($errors);
        } else {
            $model = new FormModel();
            $model->id = $id;
            return $model;
        }
    }
}
