<?php

namespace mate\abstract\clazz;

use mate\abstract\trait\Singleton;
use mate\error\SchemaError;
use WP_REST_Request;

class Validator
{
    use Singleton;

    protected Repository $repository;

    public function validId(
        WP_REST_Request $req,
        array &$errors,
        string $paramName = "id",
        bool $required = true
    ): int {
        $id = $req->get_param($paramName);

        if ($id === null) {
            if ($required) {
                $errors[] = SchemaError::paramRequired($paramName);
            }
            return 0;
        }

        $id = mate_sanitize_int($id);

        if ($id === false) {
            $errors[] = SchemaError::paramIncorrectType($paramName, "integer");
            return 0;
        }

        if ($this->repository->selectById($id) === null) {
            $errors[] = SchemaError::paramNotFound($paramName);
            return 0;
        }

        return $id;
    }

    public function validName(WP_REST_Request $req, array &$errors, string $paramName = "name"): string
    {
        $name = $req->get_param($paramName);

        if ($name === null) {
            $errors[] = SchemaError::paramRequired($paramName);
            return "";
        }

        $name = mate_sanitize_string($name);

        if ($name === false) {
            $errors[] = SchemaError::paramIncorrectType($paramName, "string");
            return "";
        }

        $l = strlen($name);

        if ($l === 0) {
            $errors[] = SchemaError::paramEmpty($paramName);
            return "";
        }

        if ($l > 255) {
            $errors[] = SchemaError::paramTooLong($paramName, 255);
            return "";
        }

        return $name;
    }

    public function validDescription(WP_REST_Request $req, array &$errors, string $paramName = "description"): string
    {
        $description = $req->get_param($paramName);

        if ($description === null) {
            $errors[] = SchemaError::paramRequired($paramName);
            return "";
        }

        $description = mate_sanitize_string($description);

        if ($description === false) {
            $errors[] = SchemaError::paramIncorrectType($paramName, "string");
            return "";
        }

        $l = strlen($description);
        if ($l === 0) {
            $errors[] = SchemaError::paramEmpty($paramName);
            return "";
        }

        if ($l > 4096) {
            $errors[] = SchemaError::paramTooLong($paramName, 4096);
            return "";
        }

        return $description;
    }

    public function validSearch(WP_REST_Request $req, string $paramName = "search"): string|null
    {
        $search = $req->get_param($paramName);

        if ($search === null) {
            return null;
        }

        $search = mate_sanitize_string($search);

        if ($search === false) {
            return null;
        }

        return $search;
    }

    public function validPageIndex(WP_REST_Request $req, string $paramName = "pageIndex"): int
    {
        $pageIndex = mate_sanitize_int($req->get_param($paramName));

        if ($pageIndex === false || $pageIndex < 1) {
            return 1;
        }

        return $pageIndex;
    }

    public function validPageSize(WP_REST_Request $req, string $paramName = "pageSize"): int
    {
        $pageSize = mate_sanitize_int($req->get_param($paramName));

        if ($pageSize === false) {
            return MATE_THEME_API_DEFAULT_PAGE_SIZE;
        }

        if ($pageSize <= 0) {
            return MATE_THEME_API_DEFAULT_PAGE_SIZE;
        }

        if ($pageSize > MATE_THEME_API_MAX_PAGE_SIZE) {
            return MATE_THEME_API_MAX_PAGE_SIZE;
        }

        return $pageSize;
    }

    public function hasError(array $errors, string $name): bool
    {
        foreach ($errors as $error) {
            if ($error["name"] === $name) {
                return true;
            }
        }

        return false;
    }

    public function hasErrors(array $errors, ...$names): bool
    {
        foreach ($names as $name) {
            if ($this->hasError($errors, $name)) {
                return true;
            }
        }

        return false;
    }
}
