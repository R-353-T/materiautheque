<?php

namespace mate\schema;

use mate\abstract\clazz\Schema;
use mate\model\TemplateModel;
use mate\validator\TemplateValidator;
use WP_REST_Request;

class TemplateSchema extends Schema
{
    private readonly TemplateValidator $validator;

    public function __construct()
    {
        $this->validator = TemplateValidator::inject();
    }

    public function update(WP_REST_Request $req, array $errors = [])
    {
        return $this->returnModel(
            [
                "id" => $this->validator->validRequestId($req, $errors),
                "childGroupList" => $this->validator->validChildGroupList($req, $errors)
            ],
            TemplateModel::class,
            $errors
        );
    }

    public function get(WP_REST_Request $req, array $errors = [])
    {
        return $this->returnModel(
            ["id" => $this->validator->validRequestId($req, $errors)],
            TemplateModel::class,
            $errors
        );
    }
}
