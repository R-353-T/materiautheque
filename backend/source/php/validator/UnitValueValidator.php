<?php

namespace mate\validator;

use mate\abstract\clazz\Validator;
use mate\error\SchemaError;
use mate\model\UnitModel;
use mate\model\UnitValueModel;
use mate\repository\UnitRepository;
use mate\repository\UnitValueRepository;
use WP_REST_Request;

class UnitValueValidator extends Validator
{
    private readonly UnitRepository $unitRepository;

    public function __construct()
    {
        $this->unitRepository = UnitRepository::inject();
        $this->repository = UnitValueRepository::inject();
    }

    public function validValueList(WP_REST_Request $req, array &$errors): array
    {
        $unitId = $req->get_param("id");
        $valueList = $req->get_param("valueList");

        if ($valueList === null) {
            $errors[] = SchemaError::paramRequired("valueList");
            return [];
        }

        $valueList = mate_sanitize_array($valueList);

        if ($valueList === false) {
            $errors[] = SchemaError::paramIncorrectType("valueList", "array");
            return [];
        }

        $unit = $unitId !== null
            ? $this->unitRepository->selectById($unitId)
            : null;

        $output = [];

        foreach ($valueList as $valueIndex => $value) {
            $vErrors = [];
            $model = $this->validValue($unit, $value, $vErrors);

            if (count($vErrors) > 0) {
                $errors[$valueIndex + 1] = $vErrors;
            } else {
                $model->position = $valueIndex + 1;
                $output[] = $model;
            }
        }

        return $output;
    }

    private function validValue(?UnitModel $unit, mixed $value, array &$errors): UnitValueModel
    {
        $model = new UnitValueModel();

        if ($value === null) {
            $errors[] = SchemaError::paramRequired("");
            return $model;
        }

        $value = mate_sanitize_array($value);
        if ($value === false) {
            $errors[] = SchemaError::paramIncorrectType("", "array");
            return $model;
        }

        $model->id = $this->validValueId($unit, $value, $errors);
        $model->value = $this->validValueValue($value, $errors);

        return $model;
    }

    private function validValueValue(mixed $value, array &$errors): string
    {
        if (!isset($value['value'])) {
            $errors[] = SchemaError::paramRequired("value");
            return "";
        }

        $value = mate_sanitize_string($value['value']);
        if ($value === false) {
            $errors[] = SchemaError::paramIncorrectType("value", "string");
            return "";
        }

        $l = strlen($value);
        if ($l === 0) {
            $errors[] = SchemaError::paramEmpty("value");
            return "";
        }

        if ($l > 255) {
            $errors[] = SchemaError::paramTooLong("value", 255);
            return "";
        }

        return $value;
    }

    private function validValueId(?UnitModel $unit, mixed $value, array &$errors): ?int
    {
        if (isset($value['id'])) {
            $req = new WP_REST_Request();
            $req->set_param("id", $value['id']);
            $valueId = $this->validId($req, $errors);

            if ($unit === null) {
                $errors[] = SchemaError::paramNotForeignOf("id", "null");
                return 0;
            }

            if ($valueId !== 0 && $unit !== null) {
                if (
                    count(array_filter(
                        $unit->valueList,
                        fn($v) => $v->id === $valueId
                    )) !== 1
                ) {
                    $errors[] = SchemaError::paramNotForeignOf("id", $unit->id);
                    return 0;
                }
            }

            return $valueId;
        } else {
            return null;
        }
    }
}
