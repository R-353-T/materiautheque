<?php

namespace mate\validator;

use mate\abstract\clazz\Service;
use mate\enumerator\BadParameterCode;
use mate\error\BadRequestBuilder;

class Validator
{
    protected mixed $repository;
    protected BadRequestBuilder $brb;

    public function __construct(mixed $repository, BadRequestBuilder $brb)
    {
        $this->repository = $repository;
        $this->brb = $brb;
    }

    public function id(mixed $id, string $parameterName = "id", bool $required = true): int
    {
        $output = 0;

        if ($id === null && $required === true) {
            $this->brb->addError($parameterName, BadParameterCode::REQUIRED);
        } elseif (($output = mate_sanitize_int($id)) === false) {
            $this->brb->addError($parameterName, BadParameterCode::INCORRECT, BadParameterCode::DATA_INCORRECT_INTEGER);
        } elseif ($this->repository->selectById($output) === null) {
            $this->brb->addError($parameterName, BadParameterCode::NOT_FOUND);
        }

        return $output;
    }

    public function search(mixed $search): ?string
    {
        if (($search = mate_sanitize_string($search)) === false) {
            $search = null;
        }

        return $search;
    }

    public function paginationIndex(mixed $index): int
    {
        if (($index = mate_sanitize_int($index)) === false || $index < 1) {
            $index = 1;
        }

        return $index;
    }

    public function paginationSize(mixed $size): int
    {
        if (($size = mate_sanitize_int($size)) === false) {
            $size = MATE_THEME_API_DEFAULT_PAGE_SIZE;
        } elseif ($size <= 0) {
            $size = MATE_THEME_API_DEFAULT_PAGE_SIZE;
        } elseif ($size > MATE_THEME_API_MAX_PAGE_SIZE) {
            $size = MATE_THEME_API_MAX_PAGE_SIZE;
        }

        return $size;
    }
}
