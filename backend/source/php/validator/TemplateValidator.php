<?php

namespace mate\validator;

use mate\abstract\clazz\Validator;
use mate\error\SchemaError;
use mate\model\GroupModel;
use mate\repository\GroupRepository;
use mate\repository\TemplateRepository;
use WP_REST_Request;

class TemplateValidator extends Validator
{
    private readonly GroupRepository $groupRepository;

    public function __construct()
    {
        $this->repository = TemplateRepository::inject();
        $this->groupRepository = GroupRepository::inject();
    }

    public function validChildGroupList(
        WP_REST_Request $req,
        array &$errors,
        string $paramName = "childGroupList"
    ): array {
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

        $childIdList = array_map(fn($c) => $c->id, $this->groupRepository->selectTemplateChildList($id));

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

        if (!isset($value['id'])) {
            $errors[] = SchemaError::paramRequired("id");
            return $model;
        }

        $valueId = $this->validRequestId($group['id'], $errors);

        if ($valueId !== 0 && count(array_filter($in, fn($v) => $v === $valueId)) === 0) {
            $errors[] = SchemaError::paramNotForeignOf("id", $parentId);
            return $model;
        }
    }
}
