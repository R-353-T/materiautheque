<?php

namespace mate\validator;

use mate\abstract\clazz\Validator;
use mate\error\SchemaError;
use mate\repository\ImageRepository;

class ImageValidator extends Validator
{
    private static array $MIME_LIST = [
      "png"   => "image/png",
      "jpg"   => "image/jpeg",
      "jpeg"  => "image/jpeg",
    ];

    public function __construct()
    {
        $this->repository = ImageRepository::inject();
    }

    public function validRequestFile(array $req, array &$errors, array $options = []): array|null
    {
        $file = null;

        if (!isset($options["required"])) {
            $options["required"] = true;
        }

        if ((!isset($req["file"]))) {
            if ($options["required"] === true) {
                $errors[] = SchemaError::required("file");
            }
        } else {
            $metadata = wp_check_filetype($req["file"]["name"]);

            $incorrect = isset($metadata["ext"]) === false
            || isset($metadata["type"]) === false
            || isset($req["file"]["size"]) === false;

            if ($incorrect) {
                $errors[] = SchemaError::incorrectType("file", "file");
            } elseif (
                isset(self::$MIME_LIST[$metadata["ext"]]) === false
                || $metadata["type"] !== self::$MIME_LIST[$metadata["ext"]]
            ) {
                $errors[] = SchemaError::fileNotSupported("file");
            } elseif ($req["file"]["size"] > MATE_THEME_API_IMAGE_MAX_SIZE) {
                $errors[] = SchemaError::fileTooLarge("file");
            } else {
                $file = $req["file"];
            }
        }

        return $file;
    }
}
