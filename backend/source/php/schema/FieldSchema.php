<?php

namespace mate\schema;

use mate\abstract\clazz\Schema;
use mate\model\FieldModel;
use mate\validator\EnumeratorValidator;
use mate\validator\FieldValidator;
use mate\validator\GroupValidator;
use mate\validator\TypeValidator;
use mate\validator\UnitValidator;
use WP_REST_Request;

class FieldSchema extends Schema
{
    private readonly FieldValidator $validator;
    private readonly GroupValidator $groupValidator;
    private readonly TypeValidator $typeValidator;
    private readonly EnumeratorValidator $enumeratorValidator;
    private readonly UnitValidator $unitValidator;

    public function __construct()
    {
        parent::__construct();
        $this->validator = new FieldValidator($this->brb);
        $this->groupValidator = new GroupValidator($this->brb);
        $this->enumeratorValidator = new EnumeratorValidator($this->brb);
        $this->unitValidator = new UnitValidator($this->brb);
        $this->typeValidator = new TypeValidator($this->brb);
    }

    public function create(WP_REST_Request $request)
    {
        $model = new FieldModel();
        $model->name = $this->validator->name($request->get_param("name"));
        $model->description = $this->validator->description($request->get_param("description"));
        $model->isRequired = $this->validator->isRequired($request->get_param("isRequired"));
        $model->groupId = $this->groupValidator->id($request->get_param("groupId"), true, "groupId");
        $model->typeId = $this->typeValidator->id($request->get_param("typeId"), true, "typeId");
        $model->unitId = $this->unitValidator->id($request->get_param("unitId"), false, "unitId");

        $model->enumeratorId = $this->enumeratorValidator->id(
            $request->get_param("enumeratorId"),
            false,
            "enumeratorId"
        );

        $model->allowMultipleValues = $this->validator->allowMultipleValues(
            $request->get_param("allowMultipleValues"),
            $model->typeId
        );

        $this->validator->typeWithEnumerator($model->typeId, $model->enumeratorId);
        $this->validator->typeWithUnit($model->typeId, $model->unitId);

        return $this->brb->containErrors()
            ? $this->brb->build()
            : $model;
    }

    public function update(WP_REST_Request $request)
    {
        $model = new FieldModel();
        $model->id = $this->validator->id($request->get_param("id"));
        $model->name = $this->validator->name($request->get_param("name"));
        $model->description = $this->validator->description($request->get_param("description"));
        $model->isRequired = $this->validator->isRequired($request->get_param("isRequired"));
        $model->groupId = $this->groupValidator->id($request->get_param("groupId"), true, "groupId");
        $model->typeId = $this->typeValidator->id($request->get_param("typeId"), true, "typeId");
        $model->unitId = $this->unitValidator->id($request->get_param("unitId"), false, "unitId");

        $model->enumeratorId = $this->enumeratorValidator->id(
            $request->get_param("enumeratorId"),
            false,
            "enumeratorId"
        );

        $model->allowMultipleValues = $this->validator->allowMultipleValues(
            $request->get_param("allowMultipleValues"),
            $model->typeId
        );

        $this->validator->typeWithEnumerator($model->typeId, $model->enumeratorId);
        $this->validator->typeWithUnit($model->typeId, $model->unitId);

        return $this->brb->containErrors()
            ? $this->brb->build()
            : $model;
    }

    public function list(WP_REST_Request $request)
    {
        $groupId = $this->groupValidator->id($request->get_param("groupId"), true, "groupId");

        return $this->brb->containErrors()
            ? $this->brb->build()
            : [
                "groupId" => $groupId,
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
