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
    private readonly TypeValueValidator $typeValidator;

    public function __construct()
    {
        $this->repository = UnitValueRepository::inject();
        $this->unitRepository = UnitRepository::inject();
        $this->typeValidator = TypeValueValidator::inject();
    }

    public function validValueList(WP_REST_Request $req, array &$errors): array
    {
        $output = [];
        $unitId = $req->get_param("id");
        $valueList = $req->get_param("valueList");

        if ($this->hasError($errors, "id")) {
            return [];
        }

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

        foreach ($valueList as $valueIndex => $value) {
            $vErrors            = SchemaError::paramGroupError("valueList", $valueIndex);
            $model              = $this->validValue($unit, $value, $vErrors["errors"]);
            $model->position    = $valueIndex + 1;
            $output[]           = $model;

            if (count($vErrors["errors"]) > 0) {
                $errors[] = $vErrors;
            }
        }

        return $output;
    }

    private function validValue(?UnitModel $unit, mixed $value, array &$errors): UnitValueModel
    {
        $model = new UnitValueModel();

        if ($value === null) {
            $errors[] = SchemaError::paramRequired("__MAIN__");
            return $model;
        }

        $value = mate_sanitize_array($value);

        if ($value === false) {
            $errors[] = SchemaError::paramIncorrectType("__MAIN__", "array");
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

        $value = $this->typeValidator->validLabel($value['value'], $errors, "value");

        if (count($errors) === 0 && is_string($value) && strlen($value) === 0) {
            $errors[] = SchemaError::paramEmpty("value");
            return "";
        }

        return $value;
    }

    private function validValueId(?UnitModel $unit, mixed $value, array &$errors): ?int
    {
        if (isset($value['id'])) {
            if ($unit === null) {
                $errors[] = SchemaError::paramNotForeignOf("id", "null");
                return 0;
            }

            $valueId = $this->validRequestId($value['id'], $errors);

            if (
                $valueId !== 0
                && count(array_filter($unit->valueList, fn($v) => $v->id === $valueId)) === 0
            ) {
                $errors[] = SchemaError::paramNotForeignOf("id", $unit->id);
                return 0;
            }

            return $valueId;
        } else {
            return null;
        }
    }
}
