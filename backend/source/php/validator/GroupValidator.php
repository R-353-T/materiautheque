<?php

namespace mate\validator;

use mate\abstract\clazz\Validator;
use mate\error\SchemaError;
use mate\model\FieldModel;
use mate\model\GroupModel;
use mate\repository\GroupRepository;
use WP_REST_Request;

class GroupValidator extends Validator
{
    private readonly GroupRepository $groupRepository;

    public function __construct()
    {
        $this->repository = GroupRepository::inject();
        $this->groupRepository = GroupRepository::inject();
    }

    public function validRequestParentId(
        WP_REST_Request $req,
        array &$errors,
        string $paramName = "parentId"
    ): int|null {
        $parentId = null;

        if (
            $this->validRequestId($req, $errors, $paramName, ["required" => false]) !== null
            && $this->hasError($errors, "id", "templateId") === false
        ) {
            $id = $req->get_param("id");
            $parentId = (int) $req->get_param($paramName);
            $parent = $this->repository->selectById($parentId);

            if ($id !== null) {
                $group = $this->repository->selectById($id);

                if ($group->templateId !== $parent->templateId) {
                    $errors[] = SchemaError::templateGroupMissmatch($paramName);
                } elseif ($this->groupRepository->circularParentId($id, $parentId)) {
                    $errors[] = SchemaError::templateParentCircular($paramName);
                }
            } else {
                $templateId = (int) $req->get_param("templateId");

                if ($templateId !== $parent->templateId) {
                    $errors[] = SchemaError::templateGroupMissmatch($paramName);
                }
            }
        }

        return $parentId;
    }

    public function validRequestGroupList(
        WP_REST_Request $req,
        array &$errors,
        string $paramName = "groupList"
    ): array {
        $groupList = [];
        $id = $req->get_param("id");
        $dtoList = $req->get_param($paramName);

        if ($this->hasError($errors, "id") !== false) {
            if ($dtoList === null) {
                $errors[] = SchemaError::required($paramName);
            } elseif (mate_sanitize_array($dtoList) === false) {
                $errors[] = SchemaError::incorrectType($paramName, "array");
            } else {
                foreach ($dtoList as $dtoIndex => $dto) {
                    $groupList[$dtoIndex] = $this->validGroupDto(
                        $dto,
                        $errors,
                        $paramName,
                        [
                            "groupId" => $id,
                            "index" => $dtoIndex
                        ]
                    );
                }
            }
        }

        return $groupList;
    }

    private function validGroupDto(
        mixed $dto,
        array &$errors,
        string $paramName,
        array $options
    ): GroupModel {
        $model = new GroupModel();

        if (mate_sanitize_array($dto) === false) {
            $err = SchemaError::incorrectType($paramName, "array");
            $err["index"] = $options["index"];
            $errors[] = $err;
            $model = null;
        } else {
            // valid - id

            if (isset($dto["id"]) === false) {
                $err = SchemaError::required($paramName);
                $err["index"] = $options["index"];
                $err["property"] = "id";
                $errors[] = $err;
                $model = null;
            } elseif (mate_sanitize_int($dto["id"]) === false) {
                $err = SchemaError::incorrectType($paramName, "integer");
                $err["index"] = $options["index"];
                $err["property"] = "id";
                $errors[] = $err;
                $model = null;
            } elseif ($this->groupRepository->containsGroupId($options["groupId"], $dto["id"]) === false) {
                $err = SchemaError::notForeignOf($paramName, $options["groupId"]);
                $err["index"] = $options["index"];
                $err["property"] = "id";
                $errors[] = $err;
                $model = null;
            } else {
                $model->id = $dto["id"];
            }
        }

        return $model;
    }

    public function validRequestFieldList(
        WP_REST_Request $req,
        array &$errors,
        string $paramName = "fieldList"
    ): array {
        $fieldList = [];
        $id = $req->get_param("id");
        $dtoList = $req->get_param($paramName);

        if ($this->hasError($errors, "id") !== false) {
            if ($dtoList === null) {
                $errors[] = SchemaError::required($paramName);
            } elseif (mate_sanitize_array($dtoList) === false) {
                $errors[] = SchemaError::incorrectType($paramName, "array");
            } else {
                foreach ($dtoList as $dtoIndex => $dto) {
                    $fieldList[$dtoIndex] = $this->validFieldDto(
                        $dto,
                        $errors,
                        $paramName,
                        [
                            "groupId" => $id,
                            "index" => $dtoIndex
                        ]
                    );
                }
            }
        }

        return $fieldList;
    }

    private function validFieldDto(
        mixed $dto,
        array &$errors,
        string $paramName,
        array $options
    ): FieldModel {
        $model = new FieldModel();

        if (mate_sanitize_array($dto) === false) {
            $err = SchemaError::incorrectType($paramName, "array");
            $err["index"] = $options["index"];
            $errors[] = $err;
            $model = null;
        } else {
            // valid - id

            if (isset($dto["id"]) === false) {
                $err = SchemaError::required($paramName);
                $err["index"] = $options["index"];
                $err["property"] = "id";
                $errors[] = $err;
                $model = null;
            } elseif (mate_sanitize_int($dto["id"]) === false) {
                $err = SchemaError::incorrectType($paramName, "integer");
                $err["index"] = $options["index"];
                $err["property"] = "id";
                $errors[] = $err;
                $model = null;
            } elseif ($this->groupRepository->containsFieldId($options["groupId"], $dto["id"]) === false) {
                $err = SchemaError::notForeignOf($paramName, $options["groupId"]);
                $err["index"] = $options["index"];
                $err["property"] = "id";
                $errors[] = $err;
                $model = null;
            } else {
                $model->id = $dto["id"];
            }
        }

        return $model;
    }
}
