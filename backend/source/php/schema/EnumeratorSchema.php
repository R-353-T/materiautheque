<?php

namespace mate\schema;

use mate\abstract\clazz\Schema;
use mate\model\EnumeratorModel;
use mate\validator\EnumeratorValidator;
use mate\validator\TypeValidator;
use WP_REST_Request;

class EnumeratorSchema extends Schema
{
    private readonly EnumeratorValidator $validator;
    private readonly TypeValidator $typeValidator;

    public function __construct()
    {
        parent::__construct();
        $this->validator = new EnumeratorValidator($this->brb);
        $this->typeValidator = new TypeValidator($this->brb);
    }

    public function create(WP_REST_Request $request)
    {
        $model = new EnumeratorModel();
        $model->name = $this->validator->uName($request->get_param("name"));
        $model->description = $this->validator->description($request->get_param("description"));
        $model->typeId = $this->validator->typeId($request->get_param("typeId"));
        $model->valueList = $this->validator->valueList($request->get_param("valueList"), $model->typeId);

        return $this->brb->containErrors()
            ? $this->brb->build()
            : $model;
    }

    public function update(WP_REST_Request $request)
    {
        $model = new EnumeratorModel();
        $model->id = $this->validator->id($request->get_param("id"));
        $model->name = $this->validator->uName($request->get_param("name"), $model->id);
        $model->description = $this->validator->description($request->get_param("description"));
        $model->typeId = $this->validator->typeId($request->get_param("typeId"));
        $model->valueList = $this->validator->valueList($request->get_param("valueList"), $model->id);

        return $this->brb->containErrors()
            ? $this->brb->build()
            : $model;
    }

    public function list(WP_REST_Request $request)
    {
        $typeId = $this->typeValidator->id($request->get_param("typeId"), false, "typeId");
        $typeId = $typeId === 0 ? null : $typeId;

        return $this->brb->containErrors()
            ? $this->brb->build()
            : [
                "search" => $this->validator->search($request->get_param("search")),
                "index" => $this->validator->paginationIndex($request->get_param("index")),
                "size" => $this->validator->paginationSize($request->get_param("size")),
                "typeId" => $typeId
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
