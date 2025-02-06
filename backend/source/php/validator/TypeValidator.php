<?php

namespace mate\validator;

use mate\abstract\clazz\Validator;
use mate\error\SchemaError;

class TypeValidator extends Validator
{
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
}
