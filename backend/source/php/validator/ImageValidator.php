<?php

namespace mate\validator;

use mate\enumerator\BadParameterCode;
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
        parent::__construct(
            ImageRepository::inject(),
            $brb
        );
    }

    public function name(mixed $name, string $parameterName = "name"): ?string
    {
        if ($name === null) {
            $this->brb->addError($parameterName, BadParameterCode::REQUIRED);
        } elseif (($name = mate_sanitize_string($name)) === false) {
            $this->brb->addError($parameterName, BadParameterCode::INCORRECT, BadParameterCode::DATA_INCORRECT_STRING);
        } elseif (strlen($name) === 0) {
            $this->brb->addError($parameterName, BadParameterCode::REQUIRED);
        } elseif (strlen($name) > MATE_THEME_API_MAX_NAME_LENGTH) {
            $this->brb->addError($parameterName, BadParameterCode::STRING_MAX, BadParameterCode::DATA_STRING_MAX_NAME);
        }

        return $name;
    }

    public function file(bool $required = true): ?array
    {
        $parameterName = "file";
        $file = null;
        $metadata = null;

        if (isset($_FILES[$parameterName]) === false) {
            if ($required === true) {
                $this->brb->addError($parameterName, BadParameterCode::REQUIRED);
            }
        } elseif (
            ($metadata = wp_check_filetype($_FILES[$parameterName]["name"]))
            && (isset($metadata["ext"]) === false
            || isset($metadata["type"]) === false
            || isset($_FILES[$parameterName]["size"]) === false
            )
        ) {
            $this->brb->addError($parameterName, BadParameterCode::INCORRECT, BadParameterCode::DATA_INCORRECT_FILE);
        } elseif (
            isset(self::$MIME_LIST[$metadata["ext"]]) === false
            || $metadata["type"] !== self::$MIME_LIST[$metadata["ext"]]
        ) {
            $this->brb->addError($parameterName, BadParameterCode::FILE_NOT_SUPPORTED);
        } elseif ($_FILES[$parameterName]["size"] > MATE_THEME_API_IMAGE_MAX_SIZE) {
            $this->brb->addError($parameterName, BadParameterCode::FILE_TOO_LARGE);
        } else {
            $file = $_FILES[$parameterName];
        }

        return $file;
    }
}
