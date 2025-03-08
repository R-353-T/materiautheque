<?php

namespace mate\enumerator;

class BadParameterCode
{
    public const REQUIRED = "required";
    public const INCORRECT = "incorrect";
    public const NOT_FOUND = "not_found";
    public const UNAVAILABLE = "unavailable";

    public const NUMBER_MIN = "number_min";
    public const NUMBER_MAX = "number_max";

    public const STRING_MAX = "string_max";

    public const DATE_INVALID = "date_invalid";

    public const TYPE_NOT_ENUMERABLE = "type_not_enumerable";
    public const TYPE_NOT_MULTIPLE = "type_not_multiple";
    public const TYPE_NOT_UNITABLE = "type_not_unitable";

    public const FILE_NOT_SUPPORTED = "file_not_supported";
    public const FILE_TOO_LARGE = "file_too_large";

    public const DATA_INCORRECT_INTEGER = ["TYPE" => "INTEGER"];
    public const DATA_INCORRECT_STRING = ["TYPE" => "STRING"];

    public const DATA_INCORRECT_FILE = ["TYPE" => "FILE"];


    public const DATA_STRING_MAX_NAME = ["MAX" => MATE_THEME_API_MAX_NAME_LENGTH];
}
