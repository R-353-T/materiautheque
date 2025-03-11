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
        parent::__construct();
        $this->validator = new TemplateValidator($this->brb);
    }

    public function update(WP_REST_Request $request)
    {
        $model = new TemplateModel();
        $model->id = $this->validator->id($request->get_param("id"));
        $model->groupList = $this->validator->groupList($request->get_param("groupList"), $model->id);

        return $this->brb->containErrors()
            ? $this->brb->build()
            : $model;
    }

    public function get(WP_REST_Request $request)
    {
        $id = $this->validator->id($request->get_param("id"));

        return $this->brb->containErrors()
            ? $this->brb->build()
            : $id;
    }
}
