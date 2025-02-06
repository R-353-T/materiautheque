<?php

namespace mate\error;

class SchemaError
{
    public static function required(string $name)
    {
        return [
            "name"  => $name,
            "code"  => "param_required"
        ];
    }

    public static function empty(string $name)
    {
        return [
            "name"  => $name,
            "code"  => "param_empty"
        ];
    }

    public static function unique(string $name)
    {
        return [
            "name"  => $name,
            "code"  => "param_unique"
        ];
    }

    public static function tooLong(string $name, int $max)
    {
        return [
            "name"  => $name,
            "code"  => "param_too_long",
            "max"   => $max
        ];
    }

    public static function malformed(string $name)
    {
        return [
            "name"      => $name,
            "code"      => "param_malformed"
        ];
    }

    public static function incorrectType(string $name, string $type)
    {
        return [
            "name"      => $name,
            "code"      => "param_incorrect_type",
            "type"      => $type
        ];
    }

    public static function notFound(string $name)
    {
        return [
            "name"      => $name,
            "code"      => "param_not_found"
        ];
    }

    // ---------------------------------------------------- //
    // ---------------------------------------------------- //

    public static function notForeignOf(string $name, string $foreign)
    {
        return [
            "name"      => $name,
            "code"      => "param_not_foreign_of",
            "foreign"   => $foreign
        ];
    }

    public static function invalidDate(string $name)
    {
        return [
            "name"      => $name,
            "code"      => "param_invalid_date",
            "format"    => MATE_DATE_FORMAT
        ];
    }

    public static function notImplemented()
    {
        return [
            "code"      => "param_not_implemented"
        ];
    }

    // ---------------------------------------------------- //
    // ---------------------------------------------------- //

    public static function fileNotSupported(string $name)
    {
        return [
            "name"      => $name,
            "code"      => "param_file_not_supported"
        ];
    }

    public static function fileTooLarge(string $name)
    {
        return [
            "name"      => $name,
            "code"      => "param_file_too_big"
        ];
    }

    public static function groupError(string $name, int $index)
    {
        return [
            "name"      => $name,
            "index"     => $index,
            "code"      => "param_group_error",
            "errors"    => []
        ];
    }

    public static function fieldNotInTemplate(string $name)
    {
        return [
            "name"      => $name,
            "code"      => "param_field_not_in_template"
        ];
    }
}
