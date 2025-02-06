<?php

namespace mate\validator;

use mate\abstract\clazz\Validator;
use mate\error\SchemaError;
use mate\model\UnitValueModel;
use mate\repository\UnitRepository;
use WP_REST_Request;

class UnitValidator extends Validator
{
    private readonly TypeValidator $typeValidator;
    private readonly UnitRepository $unitRepository;

    public function __construct()
    {
        $this->repository = UnitRepository::inject();
        $this->unitRepository = UnitRepository::inject();
        $this->typeValidator = TypeValidator::inject();
    }

    public function validRequestName(WP_REST_Request $req, array &$errors, string $paramName = "name"): string|null
    {
        $name = parent::validRequestName($req, $errors, $paramName);
        if ($this->hasError($errors, $paramName)) {
            $name = null;
        } else {
            /** @var UnitRepository */
            $repository = $this->repository;
            $model = $repository->selectByName($name);

            if ($model !== null && $model->id !== $req->get_param("id")) {
                $errors[] = SchemaError::unique($paramName);
                $name = null;
            }
        }

        return $name;
    }

    /**
     * @return UnitValueModel[]|null
     */
    public function validRequestValueList(
        WP_REST_Request $req,
        array &$errors,
        string $paramName = "valueList"
    ): array|null {
        $valueList = [];

        if ($this->hasError($errors, "id") === false) {
            $dtoList = $req->get_param($paramName);
            $unitId = $req->get_param("id");

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
                            "unitId" => $unitId,
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
    ): ?UnitValueModel {
        $model = new UnitValueModel();
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
                $value = $this->typeValidator->validLabel($dto["value"], $paramName);

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
                    $model->value = $value;
                }
            }

            // valid - id

            if ($model !== null && isset($dto["id"])) {
                if ($options["unitId"] === null) {
                    $err = SchemaError::notForeignOf($paramName, "null");
                    $err["index"] = $options["index"];
                    $err["property"] = "id";
                    $errors[] = $err;
                    $model = null;
                } elseif ($this->unitRepository->containsValueById($options["unitId"], $dto["id"]) === false) {
                    $err = SchemaError::notForeignOf($paramName, $options["unitId"]);
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
