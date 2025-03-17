<?php

namespace mate\error;

use WP_Error;

class WPErrorBuilder
{
    public static function forbiddenError(): WP_Error
    {
        return new WP_Error(
            "forbidden",
            "Forbidden",
            ["status" => 403]
        );
    }

    public static function badRequestError(array $params): WP_Error
    {
        return new WP_Error(
            "bad_request",
            "Bad request",
            [
                "status" => 400,
                "params" => $params
            ]
        );
    }

    public static function internalServerError(string|null $message = null, string|null $trace = null): WP_Error
    {
        return new WP_Error(
            "internal_server_error",
            ($message !== null ? $message : "Critical error"),
            [
                "status" => 500,
                "trace" => $trace
            ]
        );
    }

    public static function notFoundError(): WP_Error
    {
        return new WP_Error(
            "not_found",
            "Not found",
            ["status" => 404]
        );
    }
}
