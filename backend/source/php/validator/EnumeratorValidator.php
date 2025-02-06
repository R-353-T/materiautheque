<?php

namespace mate\validator;

use mate\abstract\clazz\Validator;
use mate\error\SchemaError;
use mate\model\EnumeratorValueModel;
use mate\repository\EnumeratorRepository;
use mate\repository\TypeRepository;
use WP_REST_Request;

class EnumeratorValidator extends Validator
{
    private readonly EnumeratorRepository $enumeratorRepository;
    private readonly TypeRepository $typeRepository;

    private readonly TypeValidator $typeValidator;

    public function __construct()
    {
        $this->repository = EnumeratorRepository::inject();
        $this->enumeratorRepository = EnumeratorRepository::inject();
        $this->typeRepository = TypeRepository::inject();

        $this->typeValidator = TypeValidator::inject();
    }

    public function validRequestName(WP_REST_Request $req, array &$errors, string $paramName = "name"): string|null
    {
        $name = parent::validRequestName($req, $errors, $paramName);
        if ($this->hasError($errors, $paramName)) {
            $name = null;
        } else {
            $model = $this->enumeratorRepository->selectByName($name);

            if ($model !== null && $model->id !== $req->get_param("id")) {
                $errors[] = SchemaError::unique($paramName);
                $name = null;
            }
        }

        return $name;
    }

    public function validRequestTypeId(
        WP_REST_Request $req,
        array &$errors,
        string $paramName = "typeId",
        array $options = []
    ): int|null {
        if (!isset($options["required"])) {
            $options["required"] = true;
        }

        $typeId = $req->get_param("typeId");

        if ($typeId === null && $options["required"] === true) {
            $errors[] = SchemaError::required($paramName);
        } elseif ($typeId !== null) {
            $typeId = $this->typeValidator->typeIdIsEnumerable($typeId, "typeId");

            if (is_array($typeId)) {
                $errors[] = $typeId;
                $typeId = null;
            }
        }

        return $typeId;
    }

    public function validRequestValueList(
        WP_REST_Request $req,
        array &$errors,
        string $paramName = "valueList"
    ): array|null {
        $valueList = [];

        if ($this->hasError($errors, "id", "typeId") === false) {
            $dtoList = $req->get_param($paramName);
            $enumeratorId = $req->get_param("id");
            $typeId = $req->get_param("typeId");
            $type = $this->typeRepository->selectById($typeId);

            if ($dtoList === null) {
                $errors[] = SchemaError::required($paramName);
            } elseif (mate_sanitize_array($valueList) === false) {
                $errors[] = SchemaError::incorrectType($paramName, "array");
            } else {
                foreach ($dtoList as $dtoIndex => $dto) {
                    $valueList[$dtoIndex] = $this->validDto(
                        $dto,
                        $errors,
                        $paramName,
                        [
                            "enumeratorId" => $enumeratorId,
                            "type" => $type,
                            "index" => $dtoIndex
                        ]
                    );
                }
            }
        }

        return $valueList;
    }

    private function validDto(
        mixed $dto,
        array &$errors,
        string $paramName,
        array $options
    ): ?EnumeratorValueModel {
        $model = new EnumeratorValueModel();
        $model->position = $options["index"];

        if (mate_sanitize_array($dto) === false) {
            $err = SchemaError::incorrectType($paramName, "array");
            $err["index"] = $options["index"];
            $errors[] = $err;
            $model = null;
        } else {
            // valid - value

            if (!isset($dto["value"])) {
                $err = SchemaError::required($paramName);
                $err["index"] = $options["index"];
                $err["property"] = "value";
                $errors[] = $err;
                $model = null;
            } else {
                $value = $this->typeValidator->validValue($options["type"]->id, $dto["value"], $paramName);

                if (is_array($value)) {
                    $value["index"] = $options["index"];
                    $err["property"] = "value";
                    $errors[] = $value;
                    $model = null;
                } elseif (strlen($value) === 0) {
                    $err = SchemaError::empty($paramName);
                    $err["index"] = $options["index"];
                    $err["property"] = "value";
                    $errors[] = $err;
                    $model = null;
                } else {
                    $column = $options["type"]->column;
                    $model->$column = $value;
                }
            }

            // valid - id

            if ($model !== null && isset($dto["id"])) {
                if ($options["enumeratorId"] === null) {
                    $err = SchemaError::notForeignOf($paramName, "null");
                    $err["index"] = $options["index"];
                    $err["property"] = "id";
                    $errors[] = $err;
                    $model = null;
                } elseif (
                    $this->enumeratorRepository->containsValueById($options["enumeratorId"], $dto["id"]) === false
                ) {
                    $err = SchemaError::notForeignOf($paramName, $options["enumeratorId"]);
                    $err["index"] = $options["index"];
                    $err["property"] = "id";
                    $errors[] = $err;
                    $model = null;
                } else {
                    $model->id = $dto["id"];
                }
            }
        }

        return $model;
    }
}
