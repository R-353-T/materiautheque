<?php

namespace mate\schema;

use mate\abstract\clazz\Schema;
use mate\error\WPErrorBuilder;
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
        $result = null;
        $id = $this->validator->validRequestId($req, $errors);
        $groupList = $this->validator->validRequestGroupList($req, $errors);

        if (count($errors) > 0) {
            $result = WPErrorBuilder::badRequestError($errors);
        } else {
            $result = new TemplateModel();
            $result->id = $id;
            $result->groupList = $groupList;
        }

        return $result;
    }

    public function get(WP_REST_Request $req, array $errors = [])
    {
        $result = null;
        $id = $this->validator->validRequestId($req, $errors);

        if (count($errors) > 0) {
            $result = WPErrorBuilder::badRequestError($errors);
        } else {
            $result = new TemplateModel();
            $result->id = $id;
        }

        return $result;
    }
}
