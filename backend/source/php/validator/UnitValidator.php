<?php

namespace mate\validator;

use mate\abstract\clazz\Validator;
use mate\error\SchemaError;
use mate\repository\UnitRepository;
use WP_REST_Request;

class UnitValidator extends Validator
{
    public function __construct()
    {
        $this->repository = UnitRepository::inject();
    }

    public function validName(WP_REST_Request $req, array &$errors, string $paramName = "name"): string
    {
        $name = parent::validName($req, $errors, $paramName);
        if (isset($errors[$paramName])) {
            return "";
        }

        /** @var UnitRepository */
        $repository = $this->repository;

        $m = $repository->selectByName($name);
        if ($m !== null && $m->id !== $req->get_param("id")) {
            $errors[] = SchemaError::paramNotUnique($paramName);
            return "";
        }

        return $name;
    }
}
