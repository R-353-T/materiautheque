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

    public function validFile(bool $required, array &$errors): array|null
    {
        if ((!isset($_FILES["file"]) || empty($_FILES["file"]))) {
            if ($required) {
                $errors[] = SchemaError::paramRequired("file");
            }
            return null;
        }

        $file = $_FILES["file"];
        $metadata = wp_check_filetype($file["name"]);

        $ok = isset($metadata["ext"]) && isset($metadata["type"]) && isset($file["size"]);
        if (!$ok) {
            $errors[] = SchemaError::paramMalformed("file");
            return null;
        }

        $ok = isset(self::$MIME_LIST[$metadata["ext"]]) && $metadata["type"] === self::$MIME_LIST[$metadata["ext"]];
        if (!$ok) {
            $errors[] = SchemaError::paramFileNotSupported("file");
            return null;
        }

        $ok = $file["size"] <= MATE_THEME_API_IMAGE_MAX_SIZE;
        if (!$ok) {
            $errors[] = SchemaError::paramFileTooLarge("file");
            return null;
        }

        return $file;
    }
}
