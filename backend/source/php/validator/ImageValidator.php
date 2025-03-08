<?php

namespace mate\validator;

use mate\enumerator\BadParameterCode as BPC;
use mate\error\BadRequestBuilder;
use mate\repository\ImageRepository;

class ImageValidator extends Validator
{
    private static array $MIME_LIST = [
        "png"   => "image/png",
        "jpg"   => "image/jpeg",
        "jpeg"  => "image/jpeg",
    ];

    public function __construct(BadRequestBuilder $brb)
    {
        parent::__construct(ImageRepository::inject(), $brb);
    }

    public function name(mixed $name, string $parameterName = "name"): ?string
    {
        if ($name === null) {
            $this->brb->addError($parameterName, BPC::REQUIRED);
            return null;
        }

        if (($name = mate_sanitize_string($name)) === false) {
            $this->brb->addError($parameterName, BPC::INCORRECT, BPC::DATA_INCORRECT_STRING);
            return null;
        }

        if (strlen($name) === 0) {
            $this->brb->addError($parameterName, BPC::REQUIRED);
            return null;
        }

        if (strlen($name) > MATE_THEME_API_MAX_NAME_LENGTH) {
            $this->brb->addError($parameterName, BPC::STRING_MAX, BPC::DATA_STRING_MAX_NAME);
            return null;
        }

        return $name;
    }

    public function file(bool $required = true): ?array
    {
        $parameterName = "file";

        if (isset($_FILES[$parameterName]) === false && $required === true) {
            $this->brb->addError($parameterName, BPC::REQUIRED);
            return null;
        }

        if (
            ($metadata = wp_check_filetype($_FILES[$parameterName]["name"]))
            && (isset($metadata["ext"]) === false
            || isset($metadata["type"]) === false
            || isset($_FILES[$parameterName]["size"]) === false
            )
        ) {
            $this->brb->addError($parameterName, BPC::INCORRECT, BPC::DATA_INCORRECT_FILE);
            return null;
        }

        if (
            isset(self::$MIME_LIST[$metadata["ext"]]) === false
            || $metadata["type"] !== self::$MIME_LIST[$metadata["ext"]]
        ) {
            $this->brb->addError($parameterName, BPC::FILE_NOT_SUPPORTED);
            return null;
        }

        if ($_FILES[$parameterName]["size"] > MATE_THEME_API_IMAGE_MAX_SIZE) {
            $this->brb->addError($parameterName, BPC::FILE_TOO_LARGE);
            return null;
        }

        return $_FILES[$parameterName];
    }
}
