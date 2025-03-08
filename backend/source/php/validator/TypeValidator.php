<?php

namespace mate\validator;

use DateTime;
use mate\abstract\clazz\Validator;
use mate\enumerator\Type;
use mate\error\BadRequestBuilder;
use mate\error\SchemaError;
use mate\model\TypeModel;
use mate\repository\EnumeratorRepository;
use mate\repository\TypeRepository;
use Throwable;

class TypeValidator extends Validator
{
    private readonly TypeRepository $typeRepository;
    private readonly EnumeratorRepository $enumeratorRepository;

    private readonly ImageValidator $imageValidator;

    // todo move into DB
    private static array $UNITABLE = [
        Type::LABEL,
        Type::TEXT,
        Type::NUMBER,
        Type::MONEY
    ];

    public function __construct()
    {
        $this->repository = TypeRepository::inject();
        $this->typeRepository = TypeRepository::inject();
        $this->enumeratorRepository = EnumeratorRepository::inject();
    }

    public function typeIdIsEnumerable(mixed $typeId, string $paramName): int|array
    {
        $errors = [];
        $typeId = $this->validId($typeId, $errors, $paramName);

        if (count($errors) > 0) {
            $typeId = $errors[0];
        } else {
            /** @var TypeModel */
            $type = $this->typeRepository->selectById($typeId);
            if ($type->allowEnumeration === false) {
                $typeId = SchemaError::typeNotEnumerable($paramName);
            };
        }

        return $typeId;
    }

    public function typeIsMultiple(mixed $typeId, string $paramName): int|array
    {
        $errors = [];
        $typeId = $this->validId($typeId, $errors, $paramName);

        if (count($errors) > 0) {
            $typeId = $errors[0];
        } else {
            /** @var TypeModel */
            $type = $this->repository->selectById($typeId);
            if ($type->allowMultipleValues === false) {
                $typeId = SchemaError::typeNotMultiple($paramName);
            };
        }

        return $typeId;
    }

    public function typeIsUnitable(mixed $typeId, string $paramName): int|array
    {
        $errors = [];
        $typeId = $this->validId($typeId, $errors, $paramName);

        if (count($errors) > 0) {
            $typeId = $errors[0];
        } else {
            if (in_array($typeId, self::$UNITABLE) === false) {
                $typeId = SchemaError::typeNotUnitable($paramName);
            };
        }

        return $typeId;
    }

    public function validValue(int $typeId, mixed $value, string $paramName, array $options = [])
    {
        switch ($typeId) {
            case Type::LABEL:
                return $this->validLabel($value, $paramName);

            case Type::TEXT:
                return $this->validText($value, $paramName);

            case Type::URL:
                return $this->validURL($value, $paramName);

            case Type::BOOLEAN:
                return $this->validBoolean($value, $paramName);

            case Type::NUMBER:
                return $this->validNumber($value, $paramName);

            case Type::MONEY:
                return $this->validMoney($value, $paramName);

            case Type::DATE:
                return $this->validDate($value, $paramName);

            case Type::IMAGE:
                return $this->validImage($value, $paramName);

            case Type::FORM:
                return $this->validForm($value, $paramName);

            case Type::ENUMERATOR:
                return $this->validEnumeration($value, $paramName, $options["enumeratorId"]);

            default:
                return SchemaError::notImplemented();
        }
    }

    public function validLabel(mixed $value, string $paramName): string|array
    {
        if ($value === null) {
            $value = SchemaError::required($paramName);
        } elseif (mate_sanitize_string($value) === false) {
            $value = SchemaError::incorrectType($paramName, "string");
        } elseif (strlen(trim($value)) > 255) {
            $value = SchemaError::tooLong($paramName, 255);
        }

        return $value;
    }


    public function validText(mixed $value, string $paramName): string|array
    {
        if ($value === null) {
            $value = SchemaError::required($paramName);
        } elseif (mate_sanitize_string($value) === false) {
            $value = SchemaError::incorrectType($paramName, "string");
        } elseif (strlen(trim($value)) > 65535) {
            $value = SchemaError::tooLong($paramName, 65535);
        }

        return $value;
    }

    public function validURL(mixed $value, string $paramName): string|array
    {
        if ($value === null) {
            $value = SchemaError::required($paramName);
        } elseif (mate_sanitize_url($value) === false) {
            $value = SchemaError::incorrectType($paramName, "url");
        } elseif (strlen($value) > 4096) {
            $value = SchemaError::tooLong($paramName, 4096);
        }

        return $value;
    }

    public function validNumber(mixed $value, string $paramName): int|float|array
    {
        if ($value === null) {
            $value = SchemaError::required($paramName);
        } else {
            $int = mate_sanitize_int($value);
            $float = mate_sanitize_float($value);

            if ($float !== false) {
                $value = $float;
            } elseif ($int !== false) {
                $value = $int;
            } else {
                $value = SchemaError::incorrectType($paramName, "float");
            }

            if (is_array($value) === false) {
                if ($value > 9999999999) {
                    $value = SchemaError::maxNumber($paramName, 9999999999);
                }

                if ($value < -9999999999) {
                    $value = SchemaError::minNumber($paramName, -9999999999);
                }
            }
        }

        return $value;
    }

    public function validMoney(mixed $value, string $paramName): string | array
    {
        $err = $this->validNumber($value, $paramName);

        if (is_array($err)) {
            return $err;
        } else {
            return filter_var($value, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
        }
    }

    public function validDate(mixed $value, string $paramName): string|array
    {
        if ($value === null) {
            $value = SchemaError::required($paramName);
        } elseif (mate_sanitize_string($value) === false) {
            $value = SchemaError::incorrectType($paramName, "string");
        } else {
            try {
                date_default_timezone_set(MATE_TIMEZONE);
                DateTime::createFromFormat(MATE_DATE_FORMAT, $value);
            } catch (Throwable $exception) {
                $value = SchemaError::invalidDate($paramName);
            }
        }

        return $value;
    }

    public function validBoolean(mixed $value, string $paramName): bool|array
    {
        $value = mate_sanitize_boolean($value);

        if ($value === null) {
            $value = SchemaError::required($paramName);
        }

        return $value;
    }

    public function validImage(mixed $value, string $paramName): int|array
    {
        $errors = [];
        // $value = $this->imageValidator->id($value, $errors, $paramName);

        // TODO: TO FIX

        if (count($errors) > 0) {
            $value = $errors[0];
        }

        return $value;
    }

    public function validForm(mixed $value, string $paramName): int|array
    {
        /** @var FormValidator */
        $formValidator = FormValidator::inject();

        $errors = [];
        $value = $formValidator->validId($value, $errors, $paramName);

        if (count($errors) > 0) {
            $value = $errors[0];
        }

        return $value;
    }

    public function validEnumeration(mixed $value, string $paramName, int $enumeratorId): int|array
    {
        $value = mate_sanitize_int($value);

        if ($value === false || $value === 0) {
            $value = SchemaError::incorrectType($paramName, "number");
        } elseif ($this->enumeratorRepository->containsValueById($enumeratorId, $value) === false) {
            $value = SchemaError::notForeignOf($paramName, $enumeratorId);
        }

        return $value;
    }
}
