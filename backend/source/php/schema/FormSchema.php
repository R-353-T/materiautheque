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
        parent::__construct();
        $this->validator = new FormValidator($this->brb);
        $this->templateValidator = new TemplateValidator($this->brb);
    }

    public function create(WP_REST_Request $request)
    {
        $templateId = $this->templateValidator->id($request->get_param("templateId"), true, "templateId");
        $name = $this->validator->name($request->get_param("name"));
        $valueList = $this->validator->valueList($request->get_param("valueList"));

        if ($this->brb->containErrors()) {
            return $this->brb->build();
        }

        $model = new FormModel();
        $model->name = $name;
        $model->templateId = $templateId;
        $model->valueList = $valueList;
        return $model;
    }

    public function update(WP_REST_Request $request)
    {
        $id = $this->validator->id($request->get_param("id"));
        $name = $this->validator->name($request->get_param("name"));
        $valueList = $this->validator->valueList($request->get_param("valueList"), $id);

        if ($this->brb->containErrors()) {
            return $this->brb->build();
        }

        $model = new FormModel();
        $model->id = $id;
        $model->name = $name;
        $model->valueList = $valueList;
        return $model;
    }

    public function list(WP_REST_Request $request): array|WP_Error
    {
        $templateId = $this->templateValidator->id($request->get_param("templateId"), true, "templateId");

        if ($this->brb->containErrors()) {
            return $this->brb->build();
        }

        return [
            "templateId" => $templateId,
            "search" => $this->validator->search($request->get_param("search")),
            "index" => $this->validator->paginationIndex($request->get_param("index")),
            "size" => $this->validator->paginationSize($request->get_param("size")),
        ];
    }

    public function get(WP_REST_Request $request)
    {
        $id = $this->validator->id($request->get_param("id"));

        if ($this->brb->containErrors()) {
            return $this->brb->build();
        }

        $model = new FormModel();
        $model->id = $id;
        return $model;
    }

    public function delete(WP_REST_Request $request)
    {
        $id = $this->validator->id($request->get_param("id"));

        if ($this->brb->containErrors()) {
            return $this->brb->build();
        }

        $model = new FormModel();
        $model->id = $id;
        return $model;
    }
}
