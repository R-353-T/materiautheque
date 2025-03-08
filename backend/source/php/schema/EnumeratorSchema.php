<?php

namespace mate\schema;

use mate\abstract\clazz\Schema;
use mate\model\EnumeratorModel;
use mate\validator\EnumeratorValidator;
use WP_REST_Request;

class EnumeratorSchema extends Schema
{
    private readonly EnumeratorValidator $validator;

    public function __construct()
    {
        parent::__construct();
        $this->validator = new EnumeratorValidator($this->brb);
    }

    public function create(WP_REST_Request $request)
    {
        $name = $this->validator->name($request->get_param("name"));
        $description = $this->validator->description($request->get_param("description"));
        $valueList = $this->validator->valueList($request->get_param("valueList"));
        $typeId = $this->validator->typeId($request->get_param("typeId"));

        if ($this->brb->containErrors()) {
            return $this->brb->build();
        }

        $model = new EnumeratorModel();
        $model->name = $name;
        $model->description = $description;
        $model->typeId = $typeId;
        $model->valueList = $valueList;
        return $model;
    }

    public function update(WP_REST_Request $request)
    {
        $id = $this->validator->id($request->get_param("id"));
        $name = $this->validator->name($request->get_param("name"));
        $description = $this->validator->description($request->get_param("description"));
        $valueList = $this->validator->valueList($request->get_param("valueList"));
        $typeId = $this->validator->typeId($request->get_param("typeId"));

        if ($this->brb->containErrors()) {
            return $this->brb->build();
        }

        $model = new EnumeratorModel();
        $model->id = $id;
        $model->name = $name;
        $model->description = $description;
        $model->typeId = $typeId;
        $model->valueList = $valueList;
        return $model;
    }

    public function list(WP_REST_Request $request)
    {
        $typeId = $this->validator->typeId($request->get_param("typeId"), false);

        if ($this->brb->containErrors()) {
            return $this->brb->build();
        }

        return [
            "search" => $this->validator->search($request->get_param("search")),
            "index" => $this->validator->paginationIndex($request->get_param("index")),
            "size" => $this->validator->paginationSize($request->get_param("size")),
            "typeId" => $typeId
        ];
    }


    public function get(WP_REST_Request $request)
    {
        $id = $this->validator->id($request->get_param("id"));

        if ($this->brb->containErrors()) {
            return $this->brb->build();
        }

        $model = new EnumeratorModel();
        $model->id = $id;
        return $model;
    }

    public function delete(WP_REST_Request $request)
    {
        $id = $this->validator->id($request->get_param("id"));

        if ($this->brb->containErrors()) {
            return $this->brb->build();
        }

        $model = new EnumeratorModel();
        $model->id = $id;
        return $model;
    }
}
