<?php

namespace mate\abstract\clazz;

use mate\error\WPErrorBuilder;
use WP_REST_Response;

abstract class Controller extends Service
{
    protected static $CONTROLLER_LIST = [];

    public static function addController(string $controller)
    {
        self::$CONTROLLER_LIST[] = $controller;
    }

    public static function loadControllers()
    {
        foreach (self::$CONTROLLER_LIST as $controller) {
            $instance = (object) call_user_func([$controller, "inject"]);
            $instance->registerRoutes();
        }
    }

    protected string $endpoint = '';
    protected array $routes = [];

    public function registerRoutes()
    {
        foreach ($this->routes as $route => $options) {
            register_rest_route(
                MATE_THEME_NAMESPACE,
                "/{$this->endpoint}/{$route}",
                [
                    "callback"              => [$this, $route],
                    "methods"               => $options["method"],
                    "permission_callback"   => $options["permission"]
                ]
            );
        }
    }

    protected function ok($data = null)
    {
        return new WP_REST_Response(
            [
                "success" => true,
                "data" => $data
            ]
        );
    }

    protected function page(array $data, int $pageIndex = null, int $pageSize = null, int $total = null)
    {
        if ($total < $pageIndex) {
            return WPErrorBuilder::notFoundError();
        }

        return new WP_REST_Response(
            [
                "success" => true,
                "data" => $data,
                "pagination" => [
                    "index" => $pageIndex,
                    "size"  => $pageSize,
                    "total" => $total
                ]
            ]
        );
    }
}
