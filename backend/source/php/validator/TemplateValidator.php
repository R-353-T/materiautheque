<?php

namespace mate\validator;

use mate\abstract\clazz\Validator;
use mate\error\SchemaError;
use mate\model\GroupModel;
use mate\repository\TemplateRepository;
use WP_REST_Request;

class TemplateValidator extends Validator
{
    private readonly TemplateRepository $templateRepository;

    public function __construct()
    {
        $this->repository = TemplateRepository::inject();
        $this->templateRepository = TemplateRepository::inject();
    }

    public function validRequestGroupList(
        WP_REST_Request $req,
        array &$errors,
        string $paramName = "groupList"
    ): array {
        $groupList = [];
        $dtoList = $req->get_param($paramName);

        if ($this->hasError($errors, "id") !== false) {
            $id = $req->get_param("id");

            if ($dtoList === null) {
                $errors[] = SchemaError::required($paramName);
            } elseif (mate_sanitize_array($groupList) === false) {
                $errors[] = SchemaError::incorrectType($paramName, "array");
            } else {
                foreach ($dtoList as $dtoIndex => $dto) {
                    $groupList[$dtoIndex] = $this->validGroupDto(
                        $dto,
                        $errors,
                        $paramName,
                        [
                            "templateId" => $id,
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
            } elseif ($this->templateRepository->containsGroupId($options["templateId"], $dto["id"]) === false) {
                $err = SchemaError::notForeignOf($paramName, $options["templateId"]);
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
