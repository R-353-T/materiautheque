<?php

namespace mate\validator;

use mate\abstract\clazz\Validator;
use mate\error\SchemaError;
use mate\model\FieldModel;
use mate\model\GroupModel;
use mate\repository\FieldRepository;
use mate\repository\GroupRepository;
use WP_REST_Request;

class GroupValidator extends Validator
{
    private readonly FieldRepository $fieldRepository;
    private readonly FieldValidator $fieldValidator;

    public function __construct()
    {
        $this->repository = GroupRepository::inject();
        $this->fieldRepository = FieldRepository::inject();
        $this->fieldValidator = FieldValidator::inject();
    }

    public function validParentId(
        WP_REST_Request $req,
        array &$errors,
        string $paramName = "parentId"
    ): int|null {
        $id = $req->get_param("id");
        $parentId = $req->get_param($paramName);

        if ($parentId === null) {
            return $parentId;
        }

        $parentId = $this->validRequestId($req, $errors, $paramName);

        if ($id !== null && !$this->hasErrors($errors, $paramName, "id")) {
            $group = $this->repository->selectById($id);
            $parent = $this->repository->selectById($parentId);

            if ($group->templateId !== $parent->templateId) {
                // todo - remove custom error
                $errors[] = [
                    "name" => $paramName,
                    "code" => "param_template_mismatch"
                ];
            }

            /** @var GroupRepository */
            $repository = $this->repository;
            $childList = $repository->selectGroupChildList($id, true);
            $childIdList = array_map(fn($c) => $c->id, $childList);
            $childIdList[] = $id;

            if (in_array($parentId, $childIdList)) {
                // todo - remove custom error
                $errors[] = [
                    "name" => $paramName,
                    "code" => "param_parent_circular"
                ];
            }
        }

        return $parentId;
    }

    public function validChildGroupList(
        WP_REST_Request $req,
        array &$errors,
        string $paramName = "childGroupList"
    ): array|null {
        $output = [];
        $childGroupList = $req->get_param($paramName);
        $id = $req->get_param("id");

        if ($this->hasError($errors, "id") || $childGroupList === null) {
            return null;
        }

        $childGroupList = mate_sanitize_array($childGroupList);

        if ($childGroupList === false) {
            $errors[] = SchemaError::paramIncorrectType($paramName, "array");
            return null;
        }

        /** @var GroupRepository */
        $repository = $this->repository;
        $childIdList = array_map(
            fn($c) => $c->id,
            $repository->selectGroupChildList($id)
        );

        foreach ($childGroupList as $groupIndex => $group) {
            $gErrors            = SchemaError::paramGroupError($paramName, $groupIndex);
            $model              = $this->validChildGroup($id, $childIdList, $group, $gErrors["errors"]);
            $model->position    = $groupIndex + 1;
            $output[]           = $model;

            if (count($gErrors["errors"]) > 0) {
                $errors[] = $gErrors;
            }
        }

        return $output;
    }

    private function validChildGroup(
        int $parentId,
        array $in,
        mixed $group,
        array &$errors
    ): GroupModel {
        $model = new GroupModel();

        if ($group === null) {
            $gErrors[] = SchemaError::paramRequired("__MAIN__");
        }

        $group = mate_sanitize_array($group);

        if ($group === false) {
            $errors[] = SchemaError::paramIncorrectType("__MAIN__", "array");
            return $model;
        }

        if (!isset($group['id'])) {
            $errors[] = SchemaError::paramRequired("id");
            return $model;
        }

        $groupId = $this->validId($group['id'], $errors);

        if ($groupId !== 0 && count(array_filter($in, fn($v) => $v === $groupId)) === 0) {
            $errors[] = SchemaError::paramNotForeignOf("id", $parentId);
            return $model;
        } else {
            $model->id = $group['id'];
        }

        return $model;
    }

    public function validFieldList(
        WP_REST_Request $req,
        array &$errors,
        string $paramName = "fieldList"
    ): array|null {
        $output = [];
        $fieldList = $req->get_param($paramName);
        $id = $req->get_param("id");

        if ($this->hasError($errors, "id") || $fieldList === null) {
            return null;
        }

        $fieldList = mate_sanitize_array($fieldList);

        if ($fieldList === false) {
            $errors[] = SchemaError::paramIncorrectType($paramName, "array");
            return null;
        }

        $fieldIdList = array_map(
            fn($c) => $c->id,
            $this->fieldRepository->selectByGroupId($id)
        );

        foreach ($fieldList as $fieldIndex => $field) {
            $fErrors            = SchemaError::paramGroupError($paramName, $fieldIndex);
            $model              = $this->validField($id, $fieldIdList, $field, $fErrors["errors"]);
            $model->position    = $fieldIndex + 1;
            $output[]           = $model;

            if (count($fErrors["errors"]) > 0) {
                $errors[] = $fErrors;
            }
        }

        return $output;
    }

    private function validField(
        int $parentId,
        array $in,
        mixed $field,
        array &$errors
    ): FieldModel {
        $model = new FieldModel();

        if ($field === null) {
            $gErrors[] = SchemaError::paramRequired("__MAIN__");
        }

        $field = mate_sanitize_array($field);

        if ($field === false) {
            $errors[] = SchemaError::paramIncorrectType("__MAIN__", "array");
            return $model;
        }

        if (!isset($field['id'])) {
            $errors[] = SchemaError::paramRequired("id");
            return $model;
        }

        $fieldId = $this->fieldValidator->validId($field['id'], $errors);

        if ($fieldId !== 0 && count(array_filter($in, fn($v) => $v === $fieldId)) === 0) {
            $errors[] = SchemaError::paramNotForeignOf("id", $parentId);
            return $model;
        } else {
            $model->id = $field['id'];
        }

        return $model;
    }
}
