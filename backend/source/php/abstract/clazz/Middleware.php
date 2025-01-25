<?php

namespace mate\abstract\clazz;

use mate\abstract\trait\Singleton;
use WP_HTTP_Response;
use WP_REST_Request;
use WP_REST_Server;

abstract class Middleware
{
    use Singleton;

    protected static $MIDDLEWARE_LIST = [];
    protected static $USER_ID = null;

    protected static function addMiddleware(string $middleware)
    {
        self::$MIDDLEWARE_LIST[] = $middleware;
    }

    protected static function isWpRequest(WP_REST_Request $request): bool
    {
        return str_starts_with($request->get_route(), "/wp/");
    }

    protected static function getUserId()
    {
        if (self::$USER_ID === null) {
            self::$USER_ID = md5($_SERVER["REMOTE_ADDR"] . $_SERVER["HTTP_USER_AGENT"]);
        }
        return self::$USER_ID;
    }

    public static function preFilter(
        mixed $response,
        WP_REST_Server $server,
        WP_REST_Request $request
    ): mixed {
        if (!self::isWpRequest($request)) {
            foreach (self::$MIDDLEWARE_LIST as $middleware) {
                $instance = call_user_func(array($middleware, "inject"));
                $response = $instance->pre($response, $server, $request);
            }
        }

        return $response;
    }

    public static function postFilter(
        WP_HTTP_Response $response,
        WP_REST_Server $server,
        WP_REST_Request $request
    ): WP_HTTP_Response {
        if (!self::isWpRequest($request)) {
            $middlewareReversedList = array_reverse(self::$MIDDLEWARE_LIST);
            foreach ($middlewareReversedList as $middleware) {
                $instance = call_user_func(array($middleware, "inject"));
                $response = $instance->post($response, $server, $request);
            }
        }

        return $response;
    }

    public static function jwtExpirationTimeFilter(): int
    {
        return time() + DAY_IN_SECONDS * 7;
    }

    public static function endpointsFilter(array $endpointList): array
    {
        $namespaceList = [
            "jwt-auth/v1",
            MATE_THEME_NAMESPACE
        ];

        if (!is_user_logged_in()) {
            foreach (array_keys($endpointList) as $endpoint) {
                $match = false;

                foreach ($namespaceList as $namespace) {
                    if (fnmatch("/" . $namespace . "/*", $endpoint, FNM_CASEFOLD)) {
                        $match = true;
                    }
                }

                if (!$match) {
                    unset($endpointList[$endpoint]);
                }
            }
        }

        return $endpointList;
    }

    public static function exportCorsHeadersFilter(array $headers, WP_REST_Request $request)
    {
        if (!self::isWpRequest($request)) {
            $headers[] = "X-RateLimit-Limit";
            $headers[] = "X-RateLimit-Remaining";
            $headers[] = "Retry-After";
        }

        return $headers;
    }


    public function pre(
        mixed $response,
        WP_REST_Server $server,
        WP_REST_Request $request
    ): mixed {
        return $response;
    }

    public function post(
        WP_HTTP_Response $response,
        WP_REST_Server $server,
        WP_REST_Request $request
    ): WP_HTTP_Response {
        return $response;
    }
}
