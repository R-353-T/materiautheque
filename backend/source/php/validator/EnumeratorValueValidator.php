<?php

namespace mate\validator;

use mate\abstract\clazz\Validator;
use mate\error\SchemaError;
use mate\model\EnumeratorModel;
use mate\model\EnumeratorValueModel;
use mate\model\TypeModel;
use mate\repository\EnumeratorRepository;
use mate\repository\EnumeratorValueRepository;
use mate\repository\TypeRepository;
use WP_REST_Request;

class EnumeratorValueValidator extends Validator
{
    private readonly EnumeratorRepository $enumeratorRepository;
    private readonly TypeRepository $typeRepository;
    private readonly TypeValueValidator $typeValueValidator;

    public function __construct()
    {
        $this->enumeratorRepository = EnumeratorRepository::inject();
        $this->repository = EnumeratorValueRepository::inject();
        $this->typeRepository = TypeRepository::inject();
        $this->typeValueValidator = TypeValueValidator::inject();
    }

    public function validValueList(WP_REST_Request $req, array &$errors): array
    {
        $output = [];
        $enumeratorId = $req->get_param("id");
        $valueList = $req->get_param("valueList");
        $typeId = $req->get_param("typeId");

        if ($this->hasErrors($errors, "id", "typeId")) {
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

        $type = $this->typeRepository->selectById($typeId);
        $enumerator = $enumeratorId !== null
            ? $this->enumeratorRepository->selectById($enumeratorId)
            : null;

        foreach ($valueList as $valueIndex => $value) {
            $vErrors            = SchemaError::paramGroupError("valueList", $valueIndex);
            $model              = $this->validValue($enumerator, $type, $value, $vErrors["errors"]);
            $model->position    = $valueIndex + 1;
            $output[]           = $model;

            if (count($vErrors["errors"]) > 0) {
                $errors[] = $vErrors;
            }
        }

        return $output;
    }

    private function validValue(
        ?EnumeratorModel $enumerator,
        TypeModel $type,
        mixed $value,
        array &$errors
    ): EnumeratorValueModel {
        $model = new EnumeratorValueModel();

        if ($value === null) {
            $errors[] = SchemaError::paramRequired("__MAIN__");
            return $model;
        }

        $value = mate_sanitize_array($value);

        if ($value === false) {
            $errors[] = SchemaError::paramIncorrectType("__MAIN__", "array");
            return $model;
        }

        $model->id = $this->validValueId($enumerator, $value, $errors);

        $c = $type->column;
        $model->$c = $this->validValueValue($type, $value, $errors);

        return $model;
    }

    private function validValueValue(TypeModel $type, mixed $value, array &$errors): mixed
    {
        if (!isset($value['value'])) {
            $errors[] = SchemaError::paramRequired("value");
            return null;
        }

        $value = $this->typeValueValidator->validValue($type, $value['value'], $errors, "value");

        if (count($errors) === 0 && is_string($value) && strlen($value) === 0) {
            $errors[] = SchemaError::paramEmpty("value");
            return "";
        }

        return $value;
    }

    private function validValueId(?EnumeratorModel $unit, mixed $value, array &$errors): ?int
    {
        if (isset($value['id'])) {
            if ($unit === null) {
                $errors[] = SchemaError::paramNotForeignOf("id", "null");
                return 0;
            }

            $req = new WP_REST_Request();
            $req->set_param("id", $value['id']);
            $valueId = $this->validId($req, $errors);

            if (
                $valueId !== 0 && $unit !== null
                && count(array_filter($unit->valueList, fn($v) => $v->id === $valueId)) === 0
            ) {
                $errors[] = SchemaError::paramNotForeignOf("id", $unit->id);
                return 0;
            }

            return $valueId;
        }

        return null;
    }
}
