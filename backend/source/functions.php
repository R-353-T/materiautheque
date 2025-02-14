<?php

require_once __DIR__ . "/php/constant.php";
require_once __DIR__ . "/php/function/autoloader.php";
require_once __DIR__ . "/php/function/sanitizer.php";

spl_autoload_register(mate_autoloader(MATE_THEME_NAMESPACE, MATE_THEME_PHP_DIRECTORY));

# Dependencies

use mate\abstract\clazz\Controller;
use mate\abstract\clazz\Middleware;
use mate\controller\EnumeratorController;
use mate\controller\FieldController;
use mate\controller\GroupController;
use mate\controller\ImageController;
use mate\controller\TemplateController;
use mate\controller\TypeController;
use mate\controller\UnitController;
use mate\middleware\AuthMiddleware;
use mate\middleware\BucketMiddleware;
use mate\service\DbMigrationService;

# Services Configuration

## Database

DbMigrationService::addDirectory(MATE_THEME_SQL_DIRECTORY);

## Middleware

Middleware::addMiddleware(AuthMiddleware::class);
Middleware::addMiddleware(BucketMiddleware::class);

## Controllers

Controller::addController(TypeController::class);
Controller::addController(ImageController::class);
Controller::addController(UnitController::class);
Controller::addController(EnumeratorController::class);
Controller::addController(TemplateController::class);
Controller::addController(GroupController::class);
Controller::addController(FieldController::class);

# Filters

add_filter("rest_pre_dispatch", [ Middleware::class, "preFilter" ], 10, 3);
add_filter("rest_post_dispatch", [ Middleware::class, "postFilter" ], 10, 3);

add_filter("rest_exposed_cors_headers", [ Middleware::class, "exportCorsHeadersFilter" ], 10, 2);
add_filter("rest_endpoints", [ Middleware::class, "endpointsFilter"]);
add_filter("jwt_auth_expire", [ Middleware::class, "jwtExpirationTimeFilter"]);

# Actions

add_action("after_switch_theme", [ DbMigrationService::inject(), "upgrade" ]);
add_action("rest_api_init", [ Controller::class, "loadControllers"]);
