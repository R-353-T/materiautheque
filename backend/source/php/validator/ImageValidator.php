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
