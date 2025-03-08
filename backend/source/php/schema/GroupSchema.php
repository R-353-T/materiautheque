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
        parent::__construct();
        $this->validator = new GroupValidator($this->brb);
        $this->templateValidator = new TemplateValidator($this->brb);
    }

    public function create(WP_REST_Request $request): GroupModel|WP_Error
    {
        $name = $this->validator->name($request->get_param("name"));
        $description = $this->validator->description($request->get_param("description"));
        $templateId = $this->templateValidator->id($request->get_param("templateId"), true, "templateId");
        $parentId = $this->validator->parentId($request->get_param("parentId"), null, $templateId);

        if ($this->brb->containErrors()) {
            return $this->brb->build();
        }

        $model = new GroupModel();
        $model->name = $name;
        $model->description = $description;
        $model->templateId = $templateId;
        $model->parentId = $parentId;
        return $model;
    }

    public function update(WP_REST_Request $request): GroupModel|WP_Error
    {
        $id = $this->validator->id($request->get_param("id"));
        $name = $this->validator->name($request->get_param("name"));
        $description = $this->validator->description($request->get_param("description"));
        $parentId = $this->validator->parentId($request->get_param("parentId"), $id, null);
        $groupList = $this->validator->groupList($request->get_param("groupList"), $id);
        $fieldList = $this->validator->fieldList($request->get_param("fieldList"), $id);

        if ($this->brb->containErrors()) {
            return $this->brb->build();
        }

        $model = new GroupModel();
        $model->id = $id;
        $model->name = $name;
        $model->description = $description;
        $model->parentId = $parentId;
        $model->groupList = $groupList;
        $model->fieldList = $fieldList;
        return $model;
    }

    public function list(WP_REST_Request $request): array|WP_Error
    {
        $templateId = $this->templateValidator->id($request->get_param("templateId"), true, "templateId");
        $parentId = $this->validator->id($request->get_param("parentId"), false, "parentId");

        return [
            "templateId" => $templateId,
            "parentId" => $parentId,
            "search" => $this->validator->search($request->get_param("search")),
            "index" => $this->validator->paginationIndex($request->get_param("index")),
            "size" => $this->validator->paginationSize($request->get_param("size")),
        ];
    }

    public function get(WP_REST_Request $request): GroupModel|WP_Error
    {
        $id = $this->validator->id($request->get_param("id"));

        if ($this->brb->containErrors()) {
            return $this->brb->build();
        }

        $model = new GroupModel();
        $model->id = $id;
        return $model;
    }

    public function delete(WP_REST_Request $request): GroupModel|WP_Error
    {
        $id = $this->validator->id($request->get_param("id"));

        if ($this->brb->containErrors()) {
            return $this->brb->build();
        }

        $model = new GroupModel();
        $model->id = $id;
        return $model;
    }
}
