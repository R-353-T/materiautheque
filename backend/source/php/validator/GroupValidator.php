<?php

namespace mate\validator;

use mate\abstract\clazz\Validator;
use mate\error\SchemaError;
use mate\model\GroupModel;
use mate\repository\GroupRepository;
use WP_REST_Request;

class GroupValidator extends Validator
{
    public function __construct()
    {
        $this->repository = GroupRepository::inject();
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

        $parentId = $this->validId($req, $errors, $paramName);

        if ($id !== null && !isset($errors[$paramName]) && !isset($errors["id"])) {
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

        if (isset($errors['id']) || $childGroupList === null) {
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
            $gErrors            = [];
            $model              = $this->validChildGroup($id, $childIdList, $group, $gErrors);
            $model->position    = $groupIndex + 1;
            $output[]           = $model;

            if (count($gErrors) > 0) {
                if (isset($errors[$paramName])) {
                    $errors[$paramName] = [];
                }

                $errors[$paramName][$model->position] = $gErrors;
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
            $gErrors[] = SchemaError::paramRequired("__value__");
        }

        $group = mate_sanitize_array($group);

        if ($group === false) {
            $errors[] = SchemaError::paramIncorrectType("__value__", "array");
            return $model;
        }

        if (!isset($group['id'])) {
            $errors[] = SchemaError::paramRequired("id");
            return $model;
        }

        $req = new WP_REST_Request();
        $req->set_param("id", $group['id']);
        $groupId = $this->validId($req, $errors);

        if ($groupId !== 0 && count(array_filter($in, fn($v) => $v === $groupId)) === 0) {
            $errors[] = SchemaError::paramNotForeignOf("id", $parentId);
            return $model;
        } else {
            $model->id = $group['id'];
        }

        return $model;
    }
}
