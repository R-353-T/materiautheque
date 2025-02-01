<?php

namespace mate\schema;

use mate\abstract\clazz\Schema;
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
        return $this->returnModel(
            [
                "name"          => $this->validator->validName($req, $errors),
                "description"   => $this->validator->validDescription($req, $errors),
                "templateId"    => $this->templateValidator->validId($req, $errors, "templateId"),
                "parentId"      => $this->validator->validParentId($req, $errors)
            ],
            GroupModel::class,
            $errors
        );
    }

    public function update(WP_REST_Request $req, array $errors = []): GroupModel|WP_Error
    {
        return $this->returnModel(
            [
                "id"                => $this->validator->validId($req, $errors),
                "name"              => $this->validator->validName($req, $errors),
                "description"       => $this->validator->validDescription($req, $errors),
                "parentId"          => $this->validator->validParentId($req, $errors),
                "childGroupList"    => $this->validator->validChildGroupList($req, $errors),
                "fieldList"         => $this->validator->validFieldList($req, $errors)
            ],
            GroupModel::class,
            $errors
        );
    }

    public function list(WP_REST_Request $req, array $errors = []): array|WP_Error
    {
        return $this->returnData(
            [
                "templateId"    => $this->templateValidator->validId($req, $errors, "templateId"),
                "parentId"      => $this->validator->validId($req, $errors, "parentId", false),
                "search"        => $this->validator->validSearch($req),
                "pageIndex"     => $this->validator->validPageIndex($req),
                "pageSize"      => $this->validator->validPageSize($req)
            ],
            $errors
        );
    }

    public function get(WP_REST_Request $req, array $errors = []): GroupModel|WP_Error
    {
        return $this->returnModel(
            ["id" => $this->validator->validId($req, $errors)],
            GroupModel::class,
            $errors
        );
    }

    public function delete(WP_REST_Request $req, array $errors = []): GroupModel|WP_Error
    {
        return $this->returnModel(
            ["id" => $this->validator->validId($req, $errors)],
            GroupModel::class,
            $errors
        );
    }
}
