<?php

namespace mate\schema;

use mate\abstract\clazz\Schema;
use mate\model\FieldModel;
use mate\validator\EnumeratorValidator;
use mate\validator\FieldValidator;
use mate\validator\GroupValidator;
use mate\validator\TypeValidator;
use mate\validator\UnitValidator;
use WP_Error;
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

    public function create(WP_REST_Request $request): FieldModel | WP_Error
    {
        $name = $this->validator->name($request->get_param("name"));
        $description = $this->validator->description($request->get_param("description"));
        $isRequired = $this->validator->isRequired($request->get_param("isRequired"));
        $groupId = $this->groupValidator->id($request->get_param("groupId"), true, "groupId");
        $typeId = $this->typeValidator->id($request->get_param("typeId"), true, "typeId");
        $enumeratorId = $this->enumeratorValidator->id($request->get_param("enumeratorId"), false, "enumeratorId");
        $unitId = $this->unitValidator->id($request->get_param("unitId"), false, "unitId");
        $amv = $this->validator->allowMultipleValues($request->get_param("allowMultipleValues"), $typeId);

        $this->validator->typeWithEnumerator($typeId, $enumeratorId);
        $this->validator->typeWithUnit($typeId, $unitId);

        if ($this->brb->containErrors()) {
            return $this->brb->build();
        }

        $model = new FieldModel();
        $model->name = $name;
        $model->description = $description;
        $model->isRequired = $isRequired;
        $model->groupId = $groupId;
        $model->typeId = $typeId;
        $model->enumeratorId = $enumeratorId;
        $model->unitId = $unitId;
        $model->allowMultipleValues = $amv;
        return $model;
    }

    public function update(WP_REST_Request $request): FieldModel | WP_Error
    {
        $id = $this->validator->id($request->get_param("id"));
        $name = $this->validator->name($request->get_param("name"));
        $description = $this->validator->description($request->get_param("description"));
        $isRequired = $this->validator->isRequired($request->get_param("isRequired"));
        $groupId = $this->groupValidator->id($request->get_param("groupId"), true, "groupId");
        $typeId = $this->typeValidator->id($request->get_param("typeId"), true, "typeId");
        $enumeratorId = $this->enumeratorValidator->id($request->get_param("enumeratorId"), false, "enumeratorId");
        $unitId = $this->unitValidator->id($request->get_param("unitId"), false, "unitId");
        $amv = $this->validator->allowMultipleValues($request->get_param("allowMultipleValues"), $typeId);

        $this->validator->typeWithEnumerator($typeId, $enumeratorId);
        $this->validator->typeWithUnit($typeId, $unitId);

        if ($this->brb->containErrors()) {
            return $this->brb->build();
        }

        $model = new FieldModel();
        $model->id = $id;
        $model->name = $name;
        $model->description = $description;
        $model->isRequired = $isRequired;
        $model->groupId = $groupId;
        $model->typeId = $typeId;
        $model->enumeratorId = $enumeratorId;
        $model->unitId = $unitId;
        $model->allowMultipleValues = $amv;
        return $model;
    }

    public function list(WP_REST_Request $request): array | WP_Error
    {
        $groupId = $this->groupValidator->id($request->get_param("groupId"), true, "groupId");

        if ($this->brb->containErrors()) {
            return $this->brb->build();
        }

        return [
            "groupId" => $groupId,
            "search" => $this->validator->search($request->get_param("search")),
            "index" => $this->validator->paginationIndex($request->get_param("index")),
            "size" => $this->validator->paginationSize($request->get_param("size")),
        ];
    }

    public function get(WP_REST_Request $request): FieldModel | WP_Error
    {
        $id = $this->validator->id($request->get_param("id"));

        if ($this->brb->containErrors()) {
            return $this->brb->build();
        }

        $model = new FieldModel();
        $model->id = $id;
        return $model;
    }

    public function delete(WP_REST_Request $request): FieldModel | WP_Error
    {
        $id = $this->validator->id($request->get_param("id"));

        if ($this->brb->containErrors()) {
            return $this->brb->build();
        }

        $model = new FieldModel();
        $model->id = $id;
        return $model;
    }
}
