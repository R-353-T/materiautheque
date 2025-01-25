<?php

namespace mate\service;

use mate\abstract\clazz\Service;
use mate\error\NotImplementedError;
use mate\error\WPErrorBuilder;
use mate\model\ImageModel;
use Throwable;
use WP_Error;

class ImageService extends Service
{
    public function upload(ImageModel $model): WP_Error|null
    {
        require_once ABSPATH . "wp-admin/includes/file.php";

        if ($model->file === null) {
            throw new NotImplementedError();
        }

        $metadata = wp_handle_upload($model->file, ["test_form" => false]);

        if (isset($metadata["error"])) {
            return WPErrorBuilder::internalServerError($metadata["error"]);
        }

        $model->url = $metadata["url"];
        $model->relative = str_replace(site_url("/"), "", $model->url);
        return null;
    }

    public function delete(string $relative)
    {
        try {
            return unlink(ABSPATH . $relative);
        } catch (Throwable $err) {
            return WPErrorBuilder::internalServerError($err->getMessage(), $err->getTraceAsString());
        }
    }
}
