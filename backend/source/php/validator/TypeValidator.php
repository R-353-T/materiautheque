<?php

namespace mate\validator;

use mate\enumerator\BadParameterCode as BPC;
use DateTime;
use mate\enumerator\Type;
use mate\error\BadRequestBuilder;
use mate\error\SchemaError;
use mate\model\FieldModel;
use mate\repository\EnumeratorRepository;
use mate\repository\FormRepository;
use mate\repository\ImageRepository;
use mate\repository\TypeRepository;
use mate\repository\UnitRepository;
use Throwable;

class TypeValidator extends Validator
{
    private readonly EnumeratorRepository $enumeratorRepository;
    private readonly UnitRepository $unitRepository;
    private readonly FormRepository $formRepository;
    private readonly ImageRepository $imageRepository;

    public function __construct(BadRequestBuilder $brb)
    {
        parent::__construct(TypeRepository::inject(), $brb);
        $this->enumeratorRepository = EnumeratorRepository::inject();
        $this->unitRepository = UnitRepository::inject();
        $this->formRepository = FormRepository::inject();
        $this->imageRepository = ImageRepository::inject();
    }

    public function MIXED(
        mixed $value,
        int $typeId,
        int $index,
        string $parameterName,
        bool $required = true,
        ?FieldModel $field = null
    ): mixed {
        switch ($typeId) {
            case Type::LABEL:
                return $this->LABEL($value, $index, $parameterName, $required);

            case Type::TEXT:
                return $this->TEXT($value, $index, $parameterName, $required);

            case Type::URL:
                return $this->URL($value, $index, $parameterName, $required);

            case Type::BOOLEAN:
                return $this->BOOLEAN($value, $index, $parameterName, $required);

            case Type::NUMBER:
                return $this->NUMBER($value, $index, $parameterName, $required);

            case Type::MONEY:
                return $this->MONEY($value, $index, $parameterName, $required);

            case Type::DATE:
                return $this->DATE($value, $index, $parameterName, $required);

            case Type::IMAGE:
                return $this->IMAGE($value, $index, $parameterName, $required);

            case Type::FORM:
                return $this->FORM($value, $index, $parameterName, $required);

            case Type::ENUMERATOR:
                return $this->ENUMVALUE($value, $index, $parameterName, $required, $field);

            default:
                return SchemaError::notImplemented();
        }
    }

    public function LABEL(mixed $value, int $index, string $name, bool $required): ?string
    {
        if ($value === null) {
            if ($required) {
                $this->brb->addError($name, BPC::REQUIRED, null, $index, "value");
            }
            return null;
        }

        if (($value = mate_sanitize_string($value)) === false) {
            $this->brb->addError($name, BPC::INCORRECT, BPC::DATA_INCORRECT_STRING, $index, "value");
            return null;
        }

        if (strlen($value) > MATE_THEME_API_MAX_NAME_LENGTH) {
            $this->brb->addError($name, BPC::STRING_MAX, BPC::DATA_STRING_MAX_NAME, $index, "value");
            return null;
        }

        if (strlen($value) === 0 && $required) {
            $this->brb->addError($name, BPC::REQUIRED, null, $index, "value");
            return null;
        }

        return $value;
    }

    public function TEXT(mixed $value, int $index, string $pn, bool $required): ?string
    {
        if ($value === null) {
            if ($required) {
                $this->brb->addError($pn, BPC::REQUIRED, null, $index, "value");
            }
            return null;
        }

        if (($value = mate_sanitize_string($value)) === false) {
            $this->brb->addError($pn, BPC::INCORRECT, BPC::DATA_INCORRECT_STRING, $index, "value");
            return null;
        }

        if (strlen($value) > MATE_THEME_API_MAX_TEXT_LENGTH) {
            $this->brb->addError($pn, BPC::STRING_MAX, BPC::DATA_STRING_MAX_TEXT, $index, "value");
            return null;
        }

        if (strlen($value) === 0 && $required) {
            $this->brb->addError($pn, BPC::REQUIRED, null, $index, "value");
            return null;
        }

        return $value;
    }

    public function URL(mixed $value, int $index, string $pn, bool $required): ?string
    {
        if ($value === null) {
            if ($required) {
                $this->brb->addError($pn, BPC::REQUIRED, null, $index, "value");
            }
            return null;
        }

        if (($value = mate_sanitize_url($value)) === false) {
            $this->brb->addError($pn, BPC::INCORRECT, BPC::DATA_INCORRECT_URL, $index, "value");
            return null;
        }

        if (strlen($value) > MATE_THEME_API_MAX_URL_LENGTH) {
            $this->brb->addError($pn, BPC::STRING_MAX, BPC::DATA_STRING_MAX_URL, $index, "value");
            return null;
        }

        if (strlen($value) === 0 && $required) {
            $this->brb->addError($pn, BPC::REQUIRED, null, $index, "value");
            return null;
        }

        return $value;
    }

    public function NUMBER(mixed $value, int $index, string $pn, bool $required): null|int|float
    {
        if ($value === null) {
            if ($required) {
                $this->brb->addError($pn, BPC::REQUIRED, null, $index, "value");
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
            $this->brb->addError($pn, BPC::INCORRECT, BPC::DATA_INCORRECT_NUMERIC, $index, "value");
            return null;
        }

        if ($value > MATE_THEME_API_MAX_NUMBER) {
            $this->brb->addError($pn, BPC::NUMBER_MAX, BPC::DATA_NUMBER_MAX, $index, "value");
            return null;
        }

        if ($value < MATE_THEME_API_MIN_NUMBER) {
            $this->brb->addError($pn, BPC::NUMBER_MIN, BPC::DATA_NUMBER_MIN, $index, "value");
            return null;
        }

        return $value;
    }

    public function MONEY(mixed $value, int $index, string $parameterName, bool $required): null|int|float|string
    {
        if ($value === null || is_string($value) && strlen($value) === 0) {
            if ($required) {
                $this->brb->addError($parameterName, BPC::REQUIRED, null, $index, "value");
            }
            return null;
        }

        $int_value = mate_sanitize_int($value);
        $float_value = mate_sanitize_float($value);

        if (is_numeric($value)) {
        } elseif ($float_value !== false) {
            $value = $float_value;
        } elseif ($int_value !== false) {
            $value = $int_value;
        } else {
            $value = false;
        }

        if ($value === false) {
            $this->brb->addError($parameterName, BPC::INCORRECT, BPC::DATA_INCORRECT_NUMERIC, $index, "value");
            return null;
        }

        return $value;
    }

    public function DATE(mixed $value, int $index, string $parameterName, bool $required): ?string
    {
        if ($value === null) {
            if ($required) {
                $this->brb->addError($parameterName, BPC::REQUIRED, null, $index, "value");
            }
            return null;
        }

        if (($value = mate_sanitize_string($value)) === false) {
            $this->brb->addError($parameterName, BPC::INCORRECT, BPC::DATA_INCORRECT_DATE, $index, "value");
            return null;
        }

        try {
            date_default_timezone_set(MATE_TIMEZONE);
            DateTime::createFromFormat(MATE_DATE_FORMAT, $value);
        } catch (Throwable $exception) {
            $this->brb->addError($parameterName, BPC::INCORRECT, BPC::DATA_INCORRECT_DATE, $index, "value");
            return null;
        }

        return $value;
    }

    public function BOOLEAN(mixed $value, int $index, string $parameterName, bool $required): ?bool
    {
        if ($value === null) {
            if ($required) {
                $this->brb->addError($parameterName, BPC::REQUIRED, null, $index, "value");
            }
            return null;
        }

        if (($value = mate_sanitize_boolean($value)) === null) {
            $this->brb->addError($parameterName, BPC::INCORRECT, BPC::DATA_INCORRECT_BOOLEAN, $index, "value");
            return null;
        }

        return $value;
    }

    public function IMAGE(mixed $value, int $index, string $parameterName, bool $required): ?int
    {
        if ($value === null) {
            if ($required) {
                $this->brb->addError($parameterName, BPC::REQUIRED, null, $index, "value");
            }
            return null;
        }

        if (($value = mate_sanitize_int($value)) === false) {
            $this->brb->addError($parameterName, BPC::INCORRECT, BPC::DATA_INCORRECT_INTEGER, $index, "value");
            return null;
        }

        if ($this->imageRepository->selectById($value) === null) {
            $this->brb->addError($parameterName, BPC::NOT_FOUND, null, $index, "value");
            return null;
        }

        return $value;
    }

    public function FORM(mixed $value, int $index, string $parameterName, bool $required): ?int
    {
        if ($value === null) {
            if ($required) {
                $this->brb->addError($parameterName, BPC::REQUIRED, null, $index, "value");
            }
            return null;
        }

        if (($value = mate_sanitize_int($value)) === false) {
            $this->brb->addError($parameterName, BPC::INCORRECT, BPC::DATA_INCORRECT_INTEGER, $index, "value");
            return null;
        }

        if ($this->formRepository->selectById($value) === null) {
            $this->brb->addError($parameterName, BPC::NOT_FOUND, null, $index, "value");
            return null;
        }

        return $value;
    }

    public function ENUMVALUE(mixed $value, int $index, string $parameterName, bool $required, FieldModel $field): ?int
    {
        if ($value === null) {
            if ($required) {
                $this->brb->addError($parameterName, BPC::REQUIRED, null, $index, "value");
            }
            return null;
        }

        if (($value = mate_sanitize_int($value)) === false) {
            $this->brb->addError($parameterName, BPC::INCORRECT, BPC::DATA_INCORRECT_INTEGER, $index, "value");
            return null;
        }

        if ($this->enumeratorRepository->containsValueById($field->enumeratorId, $value) === false) {
            $this->brb->addError($parameterName, BPC::NOT_RELATED, null, $index, "value");
            return null;
        }

        return $value;
    }

    public function UNITVALUE(mixed $value, int $index, string $parameterName, bool $required, FieldModel $field): ?int
    {
        if ($value === null) {
            if ($required) {
                $this->brb->addError($parameterName, BPC::REQUIRED, null, $index, "value");
            }
            return null;
        }

        if (($value = mate_sanitize_int($value)) === false) {
            $this->brb->addError($parameterName, BPC::INCORRECT, BPC::DATA_INCORRECT_INTEGER, $index, "value");
            return null;
        }

        if ($this->unitRepository->containsValueById($field->unitId, $value) === false) {
            $this->brb->addError($parameterName, BPC::NOT_RELATED, null, $index, "value");
            return null;
        }

        return $value;
    }
}
