<?php

namespace mate\validator;

use mate\enumerator\BadParameterCode as BPC;
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
    private readonly ?BadRequestBuilder $brb;


    // TODO: move into DB
    private static array $UNITABLE = [
        Type::LABEL,
        Type::TEXT,
        Type::NUMBER,
        Type::MONEY
    ];

    public function __construct(?BadRequestBuilder $brb = null)
    {
        $this->brb = $brb;
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

    public function MIXED(mixed $value, int $typeId, int $index, string $parameterName, bool $required = true): mixed
    {
        switch ($typeId) {
            case Type::LABEL:
                return $this->LABEL($value, $index, $parameterName, $required);

            case Type::TEXT:
                return $this->TEXT($value, $index, $parameterName, $required);

            case Type::URL:
                return $this->URL($value, $index, $parameterName, $required);

            case Type::BOOLEAN:
                // return $this->validBoolean($value, $parameterName);

            case Type::NUMBER:
                return $this->NUMBER($value, $index, $parameterName, $required);

            case Type::MONEY:
                return $this->MONEY($value, $index, $parameterName, $required);

            case Type::DATE:
                return $this->DATE($value, $index, $parameterName, $required);

            case Type::IMAGE:
                // return $this->validImage($value, $parameterName);

            case Type::FORM:
                // return $this->validForm($value, $parameterName);

            case Type::ENUMERATOR:
                // return $this->validEnumeration($value, $parameterName, $options["enumeratorId"]);

            default:
                return SchemaError::notImplemented();
        }
    }

    public function LABEL(mixed $value, int $index, string $parameterName, bool $required): ?string
    {
        if ($value === null) {
            if ($required) {
                $this->brb->addIndexedError(
                    $parameterName,
                    $index,
                    BPC::REQUIRED,
                    ["name" => "value"]
                );
            }
            return null;
        }

        if (($value = mate_sanitize_string($value)) === false) {
            $this->brb->addIndexedError(
                $parameterName,
                $index,
                BPC::INCORRECT,
                ["name" => "value", "type" => "STRING"]
            );
            return null;
        }

        if (strlen($value) > MATE_THEME_API_MAX_NAME_LENGTH) {
            $this->brb->addIndexedError(
                $parameterName,
                $index,
                BPC::STRING_MAX,
                [
                    "name" => "value",
                    "max" => MATE_THEME_API_MAX_NAME_LENGTH
                ]
            );
            return null;
        }

        if (strlen($value) === 0 && $required) {
            $this->brb->addIndexedError(
                $parameterName,
                $index,
                BPC::REQUIRED,
                ["name" => "value"]
            );
            return null;
        }

        return $value;
    }

    public function TEXT(mixed $value, int $index, string $parameterName, bool $required): ?string
    {
        if ($value === null) {
            if ($required) {
                $this->brb->addIndexedError(
                    $parameterName,
                    $index,
                    BPC::REQUIRED,
                    ["name" => "value"]
                );
            }
            return null;
        }

        if (($value = mate_sanitize_string($value)) === false) {
            $this->brb->addIndexedError(
                $parameterName,
                $index,
                BPC::INCORRECT,
                ["name" => "value", "type" => "STRING"]
            );
            return null;
        }

        if (strlen($value) > MATE_THEME_API_MAX_TEXT_LENGTH) {
            $this->brb->addIndexedError(
                $parameterName,
                $index,
                BPC::STRING_MAX,
                [
                    "name" => "value",
                    "max" => MATE_THEME_API_MAX_TEXT_LENGTH
                ]
            );
            return null;
        }

        if (strlen($value) === 0 && $required) {
            $this->brb->addIndexedError(
                $parameterName,
                $index,
                BPC::REQUIRED,
                ["name" => "value"]
            );
            return null;
        }

        return $value;
    }

    public function URL(mixed $value, int $index, string $parameterName, bool $required): ?string
    {
        if ($value === null) {
            if ($required) {
                $this->brb->addIndexedError(
                    $parameterName,
                    $index,
                    BPC::REQUIRED,
                    ["name" => "value"]
                );
            }
            return null;
        }

        if (($value = mate_sanitize_url($value)) === false) {
            $this->brb->addIndexedError(
                $parameterName,
                $index,
                BPC::URL_INVALID,
                ["name" => "value"]
            );
            return null;
        }

        if (strlen($value) > MATE_THEME_API_MAX_URL_LENGTH) {
            $this->brb->addIndexedError(
                $parameterName,
                $index,
                BPC::STRING_MAX,
                [
                    "name" => "value",
                    "max" => MATE_THEME_API_MAX_URL_LENGTH
                ]
            );
            return null;
        }

        if (strlen($value) === 0 && $required) {
            $this->brb->addIndexedError(
                $parameterName,
                $index,
                BPC::REQUIRED,
                ["name" => "value"]
            );
            return null;
        }

        return $value;
    }

    public function NUMBER(mixed $value, int $index, string $parameterName, bool $required): ?int
    {
        if ($value === null) {
            if ($required) {
                $this->brb->addIndexedError(
                    $parameterName,
                    $index,
                    BPC::REQUIRED,
                    ["name" => "value"]
                );
            }
            return null;
        }

        $int_value = mate_sanitize_int($value);
        $float_value = mate_sanitize_float($value);

        if ($float_value !== false) {
            $value = $float_value;
        } elseif ($int_value !== false) {
            $value = $int_value;
        } else {
            $value = false;
        }

        if ($value === false) {
            $this->brb->addIndexedError(
                $parameterName,
                $index,
                BPC::INCORRECT,
                [
                    "name" => "value",
                    "type" => "NUMERIC"
                ]
            );
            return null;
        }

        if ($value > MATE_THEME_API_MAX_NUMBER) {
            $this->brb->addIndexedError(
                $parameterName,
                $index,
                BPC::NUMBER_MAX,
                [
                    "name" => "value",
                    "max" => MATE_THEME_API_MAX_NUMBER
                ]
            );
            return null;
        }

        if ($value < MATE_THEME_API_MIN_NUMBER) {
            $this->brb->addIndexedError(
                $parameterName,
                $index,
                BPC::NUMBER_MIN,
                [
                    "name" => "value",
                    "min" => MATE_THEME_API_MIN_NUMBER
                ]
            );
            return null;
        }

        return $value;
    }

    public function MONEY(mixed $value, int $index, string $parameterName, bool $required): ?int
    {
        if ($value === null) {
            if ($required) {
                $this->brb->addIndexedError(
                    $parameterName,
                    $index,
                    BPC::REQUIRED,
                    ["name" => "value"]
                );
            }
            return null;
        }

        $int_value = mate_sanitize_int($value);
        $float_value = mate_sanitize_float($value);

        if ($float_value !== false) {
            $value = $float_value;
        } elseif ($int_value !== false) {
            $value = $int_value;
        } else {
            $value = false;
        }

        if ($value === false) {
            $this->brb->addIndexedError(
                $parameterName,
                $index,
                BPC::INCORRECT,
                [
                    "name" => "value",
                    "type" => "NUMERIC"
                ]
            );
            return null;
        }

        return $value;
    }

    public function DATE(mixed $value, int $index, string $parameterName, bool $required): ?string
    {
        if ($value === null) {
            if ($required) {
                $this->brb->addIndexedError(
                    $parameterName,
                    $index,
                    BPC::REQUIRED,
                    ["name" => "value"]
                );
            }
            return null;
        }

        if (($value = mate_sanitize_string($value)) === false) {
            $this->brb->addIndexedError(
                $parameterName,
                $index,
                BPC::INCORRECT,
                [
                    "name" => "value",
                    "type" => "DATE"
                ]
            );
            return null;
        }

        try {
            date_default_timezone_set(MATE_TIMEZONE);
            DateTime::createFromFormat(MATE_DATE_FORMAT, $value);
        } catch (Throwable $exception) {
            $this->brb->addIndexedError(
                $parameterName,
                $index,
                BPC::INCORRECT,
                [
                    "name" => "value",
                    "type" => "DATE"
                ]
            );
            return null;
        }

        return $value;
    }
}
