<?php

namespace mate\schema;

use mate\abstract\clazz\Schema;
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
        return $this->returnData(
            [
                "name" => $this->validator->validName($req, $errors),
                "templateId" => $this->templateValidator->validId($req, $errors, "templateId"),
                "childGroupList" => $this->validator->validChildGroupList($req, $errors) // return valueDtoHashMap
            ],
            $errors
        );
    }

    public function update(WP_REST_Request $req, array $errors = []): array|WP_Error
    {
        return $this->returnData(
            [
                "id" => $this->validator->validId($req, $errors),
                "name" => $this->validator->validName($req, $errors),
                "templateId" => $this->templateValidator->validId($req, $errors, "templateId"),
                "childGroupList" => $this->validator->validChildGroupList($req, $errors) // return valueDtoHashMap
            ],
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

    public function get(WP_REST_Request $req, array $errors = []): FormModel|WP_Error
    {
        return $this->returnModel(
            ["id" => $this->validator->validId($req, $errors)],
            FormModel::class,
            $errors
        );
    }

    public function delete(WP_REST_Request $req, array $errors = []): FormModel|WP_Error
    {
        return $this->returnModel(
            ["id" => $this->validator->validId($req, $errors)],
            FormModel::class,
            $errors
        );
    }
}
