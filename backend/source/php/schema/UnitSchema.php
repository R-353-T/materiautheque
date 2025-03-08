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
        $name = $this->validator->name($request->get_param("name"));
        $description = $this->validator->description($request->get_param("description"));
        $valueList = $this->validator->valueList($request->get_param("valueList"));

        if ($this->brb->containErrors()) {
            return $this->brb->build();
        } else {
            $model = new UnitModel();
            $model->name = $name;
            $model->description = $description;
            $model->valueList = $valueList;
            return $model;
        }
    }

    public function update(WP_REST_Request $request)
    {
        $id = $this->validator->id($request->get_param("id"));
        $name = $this->validator->name($request->get_param("name"), $id);
        $description = $this->validator->description($request->get_param("description"));
        $valueList = $this->validator->valueList($request->get_param("valueList"), $id);

        if ($this->brb->containErrors()) {
            return $this->brb->build();
        } else {
            $model = new UnitModel();
            $model->id = $id;
            $model->name = $name;
            $model->description = $description;
            $model->valueList = $valueList;
            return $model;
        }
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

        if ($this->brb->containErrors()) {
            return $this->brb->build();
        } else {
            $model = new UnitModel();
            $model->id = $id;
            return $model;
        }
    }

    public function delete(WP_REST_Request $request)
    {
        $id = $this->validator->id($request->get_param("id"));

        if ($this->brb->containErrors()) {
            return $this->brb->build();
        } else {
            $model = new UnitModel();
            $model->id = $id;
            return $model;
        }
    }
}
