<?php

namespace mate\schema;

use mate\abstract\clazz\Schema;
use mate\model\FormModel;
use mate\validator\FormValidator;
use mate\validator\TemplateValidator;
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
        $model = new FormModel();
        $model->templateId = $this->templateValidator->id($request->get_param("templateId"), true, "templateId");
        $model->name = $this->validator->name($request->get_param("name"));
        $model->valueList = $this->validator->valueList($request->get_param("valueList"), null, $model->templateId);

        return $this->brb->containErrors()
            ? $this->brb->build()
            : $model;
    }

    public function update(WP_REST_Request $request)
    {
        $model = new FormModel();
        $model->id = $this->validator->id($request->get_param("id"));
        $model->name = $this->validator->name($request->get_param("name"));
        $model->valueList = $this->validator->valueList($request->get_param("valueList"), $model->id);

        return $this->brb->containErrors()
            ? $this->brb->build()
            : $model;
    }

    public function list(WP_REST_Request $request)
    {
        $templateId = $this->templateValidator->id($request->get_param("templateId"), true, "templateId");

        return $this->brb->containErrors()
            ? $this->brb->build()
            : [
                "templateId" => $templateId,
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
