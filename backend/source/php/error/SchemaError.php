<?php

namespace mate\error;

class SchemaError
{
    public static function required(string $name)
    {
        return [
            "name"  => $name,
            "code"  => "required"
        ];
    }

    public static function empty(string $name)
    {
        return [
            "name"  => $name,
            "code"  => "empty"
        ];
    }

    public static function duplicate(string $name)
    {
        return [
            "name"  => $name,
            "code"  => "duplicate"
        ];
    }

    public static function tooLong(string $name, int $max)
    {
        return [
            "name"  => $name,
            "code"  => "too_long",
            "max"   => $max
        ];
    }

    public static function incorrectType(string $name, string $type)
    {
        return [
            "name"      => $name,
            "code"      => "incorrect_type",
            "type"      => $type
        ];
    }

    public static function notFound(string $name)
    {
        return [
            "name"      => $name,
            "code"      => "not_found"
        ];
    }

    // ---------------------------------------------------- //
    // CUSTOM
    // ---------------------------------------------------- //

    public static function notForeignOf(string $name, string $foreign)
    {
        return [
            "name"      => $name,
            "code"      => "not_foreign_of",
            "foreign"   => $foreign
        ];
    }

    public static function invalidDate(string $name)
    {
        return [
            "name"      => $name,
            "code"      => "invalid_date",
            "format"    => MATE_DATE_FORMAT
        ];
    }

    public static function notImplemented()
    {
        return [
            "code"      => "not_implemented"
        ];
    }

    // ---------------------------------------------------- //
    // TYPE
    // ---------------------------------------------------- //

    public static function typeNotEnumerable(string $name)
    {
        return [
            "name"      => $name,
            "code"      => "type_not_enumerable"
        ];
    }

    public static function typeNotMultiple(string $name)
    {
        return [
            "name"      => $name,
            "code"      => "type_not_multiple"
        ];
    }

    public static function typeNotUnitable(string $name)
    {
        return [
            "name"      => $name,
            "code"      => "type_not_unitable"
        ];
    }

    // ---------------------------------------------------- //
    // FILE
    // ---------------------------------------------------- //

    public static function fileNotSupported(string $name)
    {
        return [
            "name"      => $name,
            "code"      => "file_not_supported"
        ];
    }

    public static function fileTooLarge(string $name)
    {
        return [
            "name"      => $name,
            "code"      => "file_too_large"
        ];
    }

    // ---------------------------------------------------- //
    // TEMPLATE
    // ---------------------------------------------------- //

    public static function templateGroupMissmatch(string $name)
    {
        [
            "name" => $name,
            "code" => "template_group_missmatch"
        ];
    }

    public static function templateParentCircular(string $name)
    {
        return [
            "name" => $name,
            "code" => "parent_circular"
        ];
    }

    public static function templateFieldMissMatch(string $name)
    {
        return [
            "name" => $name,
            "code" => "field_missmatch"
        ];
    }

    // ---------------------------------------------------- //
    // FORM
    // ---------------------------------------------------- //

    public static function formFieldRequired(string $name, int $fieldId, int $groupId)
    {
        return [
            "name" => $name,
            "code" => "field_required",
            "fieldId" => $fieldId,
            "groupId" => $groupId
        ];
    }
}
