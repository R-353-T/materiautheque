<?php

namespace mate\abstract\clazz;

use mate\abstract\trait\Singleton;
use WP_REST_Response;

abstract class Controller
{
    use Singleton;

    protected static $CONTROLLER_LIST = [];

    protected static function addController(string $controller)
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
}
