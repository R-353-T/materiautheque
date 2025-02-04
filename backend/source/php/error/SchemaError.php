<?php

namespace mate\error;

class SchemaError
{
    public static function paramRequired(string $name)
    {
        return [
            "name"  => $name,
            "code"  => "param_required"
        ];
    }

    public static function paramEmpty(string $name)
    {
        return [
            "name"  => $name,
            "code"  => "param_empty"
        ];
    }

    public static function paramNotUnique(string $name)
    {
        return [
            "name"  => $name,
            "code"  => "param_not_unique"
        ];
    }

    public static function paramTooLong(string $name, int $max)
    {
        return [
            "name"  => $name,
            "code"  => "param_too_long",
            "max"   => $max
        ];
    }

    public static function paramMalformed(string $name)
    {
        return [
            "name"      => $name,
            "code"      => "param_malformed"
        ];
    }

    public static function paramIncorrectType(string $name, string $type)
    {
        return [
            "name"      => $name,
            "code"      => "param_incorrect_type",
            "type"      => $type
        ];
    }

    public static function paramFileNotSupported(string $name)
    {
        return [
            "name"      => $name,
            "code"      => "param_file_not_supported"
        ];
    }

    public static function paramFileTooLarge(string $name)
    {
        return [
            "name"      => $name,
            "code"      => "param_file_too_big"
        ];
    }

    public static function paramNotFound(string $name)
    {
        return [
            "name"      => $name,
            "code"      => "param_not_found"
        ];
    }

    public static function paramNotForeignOf(string $name, string $foreign)
    {
        return [
            "name"      => $name,
            "code"      => "param_not_foreign_of",
            "foreign"   => $foreign
        ];
    }

    public static function paramDateInvalid(string $name)
    {
        return [
            "name"      => $name,
            "code"      => "param_date_invalid",
            "format"    => MATE_DATE_FORMAT
        ];
    }

    public static function paramGroupError(string $name, int $index)
    {
        return [
            "name"      => $name,
            "index"     => $index,
            "code"      => "param_group_error",
            "errors"    => []
        ];
    }
}
