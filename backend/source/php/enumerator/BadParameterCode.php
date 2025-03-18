<?php

namespace mate\enumerator;

class BadParameterCode
{
    // CODE

    public const INCORRECT = "incorrect";
    public const NOT_FOUND = "not_found";
    public const NOT_RELATED = "not_related";
    public const REQUIRED = "required";
    public const UNAVAILABLE = "unavailable";

    public const NUMBER_MIN = "number_min";
    public const NUMBER_MAX = "number_max";

    public const STRING_MAX = "maxlength";


    public const TYPE_NOT_ENUM = "type_not_enum";
    public const TYPE_NOT_MULTIPLE = "type_not_multiple";
    public const TYPE_NOT_UNIT = "type_not_unit";

    public const FILE_NOT_SUPPORTED = "file_not_supported";
    public const FILE_TOO_LARGE = "file_too_large";

    // DATA

    public const DATA_INCORRECT_INTEGER = ["type" => "INTEGER"];
    public const DATA_INCORRECT_NUMERIC = ["type" => "NUMERIC"];
    public const DATA_INCORRECT_STRING = ["type" => "STRING"];
    public const DATA_INCORRECT_ARRAY = ["type" => "ARRAY"];
    public const DATA_INCORRECT_BOOLEAN = ["type" => "BOOLEAN"];
    public const DATA_INCORRECT_URL = ["type" => "URL"];
    public const DATA_INCORRECT_DATE = ["type" => "DATE"];
    public const DATA_INCORRECT_FILE = ["type" => "FILE"];

    public const DATA_STRING_MAX_NAME = ["requiredLength" => MATE_THEME_API_MAX_NAME_LENGTH];
    public const DATA_STRING_MAX_DESCRIPTION = ["requiredLength" => MATE_THEME_API_MAX_DESCRIPTION_LENGTH];
    public const DATA_STRING_MAX_URL = ["requiredLength" => MATE_THEME_API_MAX_DESCRIPTION_LENGTH];
    public const DATA_STRING_MAX_TEXT = ["requiredLength" => MATE_THEME_API_MAX_TEXT_LENGTH];
    public const DATA_NUMBER_MAX = ["max" => MATE_THEME_API_MAX_NUMBER];
    public const DATA_NUMBER_MIN = ["min" => MATE_THEME_API_MIN_NUMBER];

    // GROUP

    public const GROUP_CIRCULAR_REFERENCE = "circular_reference";


    // TEMPLATE

    public const TEMPLATE_MISSMATCH = "template_missmatch";
}
