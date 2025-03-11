<?php

namespace mate\schema;

use mate\abstract\clazz\Schema;
use mate\model\UnitModel;
use mate\validator\UnitValidator;
use WP_REST_Request;

class UnitSchema extends Schema
{
    private readonly UnitValidator $validator;

    public function __construct()
    {
        parent::__construct();
        $this->validator = new UnitValidator($this->brb);
    }

    public function create(WP_REST_Request $request)
    {
        $model = new UnitModel();
        $model->name = $this->validator->uName($request->get_param("name"));
        $model->description = $this->validator->description($request->get_param("description"));
        $model->valueList = $this->validator->valueList($request->get_param("valueList"));

        return $this->brb->containErrors()
            ? $this->brb->build()
            : $model;
    }

    public function update(WP_REST_Request $request)
    {
        $model = new UnitModel();
        $model->id = $this->validator->id($request->get_param("id"));
        $model->name = $this->validator->uName($request->get_param("name"), $model->id);
        $model->description = $this->validator->description($request->get_param("description"));
        $model->valueList = $this->validator->valueList($request->get_param("valueList"), $model->id);

        return $this->brb->containErrors()
            ? $this->brb->build()
            : $model;
    }

    public function list(WP_REST_Request $request)
    {
        return [
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
