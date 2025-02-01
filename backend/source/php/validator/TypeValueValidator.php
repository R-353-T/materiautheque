<?php

namespace mate\validator;

use mate\abstract\clazz\Validator;
use mate\error\SchemaError;
use mate\model\TypeModel;
use mate\repository\TypeRepository;
use mate\enumerator\Type;
use DateTime;
use Throwable;
use WP_REST_Request;

class TypeValueValidator extends Validator
{
    public function __construct()
    {
        $this->repository = TypeRepository::inject();
    }

    public function validTypeEnumeration(WP_REST_Request $req, array &$errors, string $paramName): int
    {
        $typeId = $this->validId($req, $errors, $paramName);

        if (!isset($errors[$paramName])) {
            /** @var TypeModel */
            $type = $this->repository->selectById($typeId);

            if ($type->allowEnumeration === false) {
                // todo - remove custom error
                $errors[] = [
                    "name" => $paramName,
                    "code" => "param_type_not_enumerable"
                ];

                return 0;
            };
        }

        return $typeId;
    }

    public function validTypeAllowMultipleValues(WP_REST_Request $req, array &$errors, string $paramName): int
    {
        $typeId = $this->validId($req, $errors, $paramName);

        if (!isset($errors[$paramName])) {
            /** @var TypeModel */
            $type = $this->repository->selectById($typeId);

            if ($type->allowMultipleValues === false) {
                // todo - remove custom error
                $errors[] = [
                    "name" => $paramName,
                    "code" => "param_type_not_multiple"
                ];

                return 0;
            };
        }

        return $typeId;
    }

    public function validValue(TypeModel $type, mixed $value, array &$errors, string $paramName): mixed
    {
        if ($type->id === Type::LABEL) {
            return $this->validLabel($value, $errors, $paramName);
        }

        if ($type->id === Type::TEXT) {
            return $this->validText($value, $errors, $paramName);
        }

        if ($type->id === Type::URL) {
            return $this->validURL($value, $errors, $paramName);
        }

        if ($type->id === Type::DATE) {
            return $this->validDate($value, $errors, $paramName);
        }

        if ($type->id === Type::MONEY) {
            return $this->validMoney($value, $errors, $paramName);
        }

        if ($type->id === Type::NUMBER) {
            return $this->validNumber($value, $errors, $paramName);
        }

        return null;
    }

    public function validLabel(mixed $value, array &$errors, string $paramName): string
    {
        if ($value === null) {
            $errors[] = SchemaError::paramRequired($paramName);
            return "";
        }

        $value = mate_sanitize_string($value);

        if ($value === false) {
            $errors[] = SchemaError::paramIncorrectType($paramName, "string");
            return "";
        }

        if (strlen($value) > 255) {
            $errors[] = SchemaError::paramTooLong($paramName, 255);
            return "";
        }

        return $value;
    }

    public function validText(mixed $value, array &$errors, string $paramName): string
    {
        if ($value === null) {
            $errors[] = SchemaError::paramRequired($paramName);
            return "";
        }

        $value = mate_sanitize_string($value);

        if ($value === false) {
            $errors[] = SchemaError::paramIncorrectType($paramName, "string");
            return "";
        }

        if (strlen($value) > 65535) {
            $errors[] = SchemaError::paramTooLong($paramName, 65535);
            return "";
        }

        return $value;
    }

    public function validURL(mixed $value, array &$errors, string $paramName): string
    {
        if ($value === null) {
            $errors[] = SchemaError::paramRequired($paramName);
            return "";
        }

        $value = mate_sanitize_url($value);

        if ($value === false) {
            $errors[] = SchemaError::paramIncorrectType($paramName, "url");
            return "";
        }

        if (strlen($value) > 4096) {
            $errors[] = SchemaError::paramTooLong($paramName, 4096);
            return "";
        }

        return $value;
    }

    public function validNumber(mixed $value, array &$errors, string $paramName): int|float
    {
        if ($value === null) {
            $errors[] = SchemaError::paramRequired($paramName);
            return 0;
        }

        $vint = mate_sanitize_int($value);

        if ($vint !== false) {
            return $vint;
        }

        $vfloat = mate_sanitize_float($value);

        if ($vfloat !== false) {
            return $vfloat;
        }

        $errors[] = SchemaError::paramIncorrectType($paramName, "number");
        return 0;
    }

    public function validMoney(mixed $value, array &$errors, string $paramName): int|float|string
    {
        $this->validNumber($value, $errors, $paramName);
        return filter_var($value, FILTER_SANITIZE_NUMBER_FLOAT);
    }

    public function validDate(mixed $value, array &$errors, string $paramName): string
    {
        if ($value === null) {
            $errors[] = SchemaError::paramRequired($paramName);
            return 0;
        }

        date_default_timezone_set(MATE_TIMEZONE);

        try {
            DateTime::createFromFormat(MATE_DATE_FORMAT, $value);
            return $value;
        } catch (Throwable $exception) {
            $errors[] = SchemaError::paramDateInvalid($paramName);
            return "";
        }
    }
}
