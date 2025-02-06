<?php

namespace mate\abstract\clazz;

use mate\error\SchemaError;
use WP_REST_Request;

class Validator extends Service
{
    protected Repository $repository;

    public function validRequestId(
        WP_REST_Request $req,
        array &$errors,
        string $paramName = "id",
        array $options = []
    ): int|null {
        if (isset($options['required']) === false) {
            $options['required'] = true;
        }

        $id = $req->get_param($paramName);

        if ($id === null) {
            if ($options['required'] === true) {
                $errors[] = SchemaError::required($paramName);
            }
        } else {
            $id = mate_sanitize_int($id);

            if ($id === false) {
                $errors[] = SchemaError::incorrectType($paramName, "integer");
                $id = null;
            } elseif ($this->repository->selectById($id) === null) {
                $errors[] = SchemaError::notFound($paramName);
                $id = null;
            }
        }

        return $id;
    }

    public function validId(mixed $id, array &$errors, string $paramName = "id"): int|null
    {
        $id = mate_sanitize_int($id);

        if ($id === false) {
            $errors[] = SchemaError::incorrectType($paramName, "integer");
            $id = null;
        } elseif ($this->repository->selectById($id) === null) {
            $errors[] = SchemaError::notFound($paramName);
            $id = null;
        }

        return $id;
    }

    public function validRequestName(WP_REST_Request $req, array &$errors, string $paramName = "name"): string|null
    {
        $name = $req->get_param($paramName);

        if ($name === null) {
            $errors[] = SchemaError::required($paramName);
        } else {
            $name = mate_sanitize_string($name);

            if ($name === false) {
                $errors[] = SchemaError::incorrectType($paramName, "string");
                $name = null;
            } elseif (strlen($name) === 0) {
                $errors[] = SchemaError::empty($paramName);
                $name = null;
            } elseif (strlen($name) > 255) {
                $errors[] = SchemaError::tooLong($paramName, 255);
                $name = null;
            }
        }

        return $name;
    }

    public function validRequestDescription(
        WP_REST_Request $req,
        array &$errors,
        string $paramName = "description"
    ): string|null {
        $description = $req->get_param($paramName);

        if ($description === null) {
            $errors[] = SchemaError::required($paramName);
        } else {
            $description = mate_sanitize_string($description);

            if ($description === false) {
                $errors[] = SchemaError::incorrectType($paramName, "string");
                $description = null;
            } elseif (strlen($description) > 4096) {
                $errors[] = SchemaError::tooLong($paramName, 4096);
                $description = null;
            }
        }

        return $description;
    }

    public function validSearch(WP_REST_Request $req, string $paramName = "search"): string|null
    {
        $search = $req->get_param($paramName);

        if ($search !== null) {
            $search = mate_sanitize_string($search);

            if ($search === false) {
                $search = null;
            }
        }

        return $search;
    }

    public function validPageIndex(WP_REST_Request $req, string $paramName = "index"): int
    {
        $index = $req->get_param($paramName);
        $index = mate_sanitize_int($index);

        if ($index === false || $index < 1) {
            $index = 1;
        }

        return $index;
    }

    public function validPageSize(WP_REST_Request $req, string $paramName = "size"): int
    {
        $size = mate_sanitize_int($req->get_param($paramName));

        if ($size === false) {
            $size = MATE_THEME_API_DEFAULT_PAGE_SIZE;
        } elseif ($size <= 0) {
            $size = MATE_THEME_API_DEFAULT_PAGE_SIZE;
        } elseif ($size > MATE_THEME_API_MAX_PAGE_SIZE) {
            $size = MATE_THEME_API_MAX_PAGE_SIZE;
        }

        return $size;
    }

    public function hasError(array $errors, ...$names): bool
    {
        foreach ($names as $name) {
            foreach ($errors as $error) {
                if ($error["name"] === $name) {
                    return true;
                }
            }
        }

        return false;
    }
}
