<?php

# WORDPRESS & ENVIRONMENT

defined("IS_PRODUCTION") or define("IS_PRODUCTION", wp_get_environment_type() !== "development");
defined("IS_DEVELOPMENT") or define("IS_DEVELOPMENT", wp_get_environment_type() === "development");

# GENERAL

defined("MATE_THEME_NAMESPACE") or define("MATE_THEME_NAMESPACE", "mate");
defined("MATE_THEME_DIRECTORY") or define("MATE_THEME_DIRECTORY", get_template_directory());
defined("MATE_THEME_PHP_DIRECTORY") or define("MATE_THEME_PHP_DIRECTORY", MATE_THEME_DIRECTORY . "/php");

# SQL

defined("MATE_THEME_SQL_DIRECTORY") or define("MATE_THEME_SQL_DIRECTORY", MATE_THEME_DIRECTORY . "/sql");

# DATE & TIME

defined("MATE_TIMEZONE") or define("MATE_TIMEZONE", "Europe/Paris");
defined("MATE_DATE_FORMAT") or define("MATE_DATE_FORMAT", "Y-m-d H:i:s");

# API

defined("MATE_THEME_AUTH_ENDPOINT") or define("MATE_THEME_AUTH_ENDPOINT", "/jwt-auth/v1/token");

defined("MATE_THEME_API_BUCKET_LIMIT") or define("MATE_THEME_API_BUCKET_LIMIT", 48);
defined("MATE_THEME_API_BUCKET_TIME") or define("MATE_THEME_API_BUCKET_TIME", 8);

defined("MATE_THEME_API_MAX_LOGIN_ATTEMPS") or define("MATE_THEME_API_MAX_LOGIN_ATTEMPS", 5);
defined("MATE_THEME_API_LOGIN_JAIL_TIME") or define("MATE_THEME_API_LOGIN_JAIL_TIME", IS_PRODUCTION ? 300 : 12);

defined("MATE_THEME_API_MAX_PAGE_SIZE") or define("MATE_THEME_API_MAX_PAGE_SIZE", 255);
defined("MATE_THEME_API_DEFAULT_PAGE_SIZE") or define("MATE_THEME_API_DEFAULT_PAGE_SIZE", 32);

defined("MATE_THEME_API_IMAGE_MAX_SIZE") or define("MATE_THEME_API_IMAGE_MAX_SIZE", 10 * 1024 * 1024); // 10 Mo
