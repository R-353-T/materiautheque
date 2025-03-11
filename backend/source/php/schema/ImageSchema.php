<?php

namespace mate\schema;

use mate\abstract\clazz\Schema;
use mate\model\ImageModel;
use mate\validator\ImageValidator;
use WP_Error;
use WP_REST_Request;

class ImageSchema extends Schema
{
    private readonly ImageValidator $validator;

    public function __construct()
    {
        parent::__construct();
        $this->validator = new ImageValidator($this->brb);
    }

    public function create(WP_REST_Request $request)
    {
        $model = new ImageModel();
        $model->name = $this->validator->name($request->get_param("name"));
        $model->file = $this->validator->file();

        return $this->brb->containErrors()
            ? $this->brb->build()
            : $model;
    }

    public function update(WP_REST_Request $request)
    {
        $model = new ImageModel();
        $model->id = $this->validator->id($request->get_param("id"));
        $model->name = $this->validator->name($request->get_param("name"));
        $model->file = $this->validator->file(false);

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
