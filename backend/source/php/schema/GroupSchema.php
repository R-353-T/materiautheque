<?php

namespace mate\schema;

use mate\abstract\clazz\Schema;
use mate\error\WPErrorBuilder;
use mate\model\GroupModel;
use mate\validator\GroupValidator;
use mate\validator\TemplateValidator;
use WP_Error;
use WP_REST_Request;

class GroupSchema extends Schema
{
    private readonly GroupValidator $validator;
    private readonly TemplateValidator $templateValidator;

    public function __construct()
    {
        $this->validator = GroupValidator::inject();
        $this->templateValidator = TemplateValidator::inject();
    }

    public function create(WP_REST_Request $req, array $errors = []): GroupModel|WP_Error
    {
        $name = $this->validator->validRequestName($req, $errors);
        $description = $this->validator->validRequestDescription($req, $errors);
        $templateId = $this->templateValidator->validRequestId($req, $errors, "templateId");
        $parentId = $this->validator->validRequestParentId($req, $errors);

        if (count($errors) > 0) {
            return WPErrorBuilder::badRequestError($errors);
        } else {
            $model = new GroupModel();
            $model->name = $name;
            $model->description = $description;
            $model->templateId = $templateId;
            $model->parentId = $parentId;
            return $model;
        }
    }

    public function update(WP_REST_Request $req, array $errors = []): GroupModel|WP_Error
    {
        $id = $this->validator->validRequestId($req, $errors);
        $name = $this->validator->validRequestName($req, $errors);
        $description = $this->validator->validRequestDescription($req, $errors);
        $parentId = $this->validator->validRequestParentId($req, $errors);
        $groupList = $this->validator->validRequestGroupList($req, $errors);
        $fieldList = $this->validator->validRequestFieldList($req, $errors);

        if (count($errors) > 0) {
            return WPErrorBuilder::badRequestError($errors);
        } else {
            $model = new GroupModel();
            $model->id = $id;
            $model->name = $name;
            $model->description = $description;
            $model->parentId = $parentId;
            $model->groupList = $groupList;
            $model->fieldList = $fieldList;
            return $model;
        }
    }

    public function list(WP_REST_Request $req, array $errors = []): array|WP_Error
    {
        return $this->returnData(
            [
                "templateId"    => $this->templateValidator->validRequestId($req, $errors, "templateId"),
                "parentId"      => $this->validator->validRequestId($req, $errors, "parentId", ["required" => false]),
                "search"        => $this->validator->validSearch($req),
                "index"         => $this->validator->validPageIndex($req),
                "size"          => $this->validator->validPageSize($req)
            ],
            $errors
        );
    }

    public function get(WP_REST_Request $req, array $errors = []): GroupModel|WP_Error
    {
        $id = $this->validator->validRequestId($req, $errors);

        if (count($errors) > 0) {
            return WPErrorBuilder::badRequestError($errors);
        } else {
            $model = new GroupModel();
            $model->id = $id;
            return $model;
        }
    }

    public function delete(WP_REST_Request $req, array $errors = []): GroupModel|WP_Error
    {
        $id = $this->validator->validRequestId($req, $errors);

        if (count($errors) > 0) {
            return WPErrorBuilder::badRequestError($errors);
        } else {
            $model = new GroupModel();
            $model->id = $id;
            return $model;
        }
    }
}
