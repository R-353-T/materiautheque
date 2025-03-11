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

    public function create(WP_REST_Request $request)
    {
        $model = new GroupModel();
        $model->name = $this->validator->name($request->get_param("name"));
        $model->description = $this->validator->description($request->get_param("description"));
        $model->templateId = $this->templateValidator->id($request->get_param("templateId"), true, "templateId");
        $model->parentId = $this->validator->parentId($request->get_param("parentId"), null, $model->templateId);

        return $this->brb->containErrors()
            ? $this->brb->build()
            : $model;
    }

    public function update(WP_REST_Request $request)
    {
        $model = new GroupModel();
        $model->id = $this->validator->id($request->get_param("id"));
        $model->name = $this->validator->name($request->get_param("name"));
        $model->description = $this->validator->description($request->get_param("description"));
        $model->parentId = $this->validator->parentId($request->get_param("parentId"), $model->id, null);
        $model->groupList = $this->validator->groupList($request->get_param("groupList"), $model->id);
        $model->fieldList = $this->validator->fieldList($request->get_param("fieldList"), $model->id);

        return $this->brb->containErrors()
            ? $this->brb->build()
            : $model;
    }

    public function list(WP_REST_Request $request)
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

    public function get(WP_REST_Request $request)
    {
        $id = $this->validator->id($request->get_param("id"));

        return $this->brb->containErrors()
            ? $this->brb->build()
            : $id;
    }

    public function delete(WP_REST_Request $request)
    {
        $id = $this->validator->id($request->get_param("id"));

        return $this->brb->containErrors()
            ? $this->brb->build()
            : $id;
    }
}
