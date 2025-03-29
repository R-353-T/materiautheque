<?php

namespace mate\validator;

use mate\enumerator\BadParameterCode as BPC;
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

    public function id(mixed $id, bool $required = true, string $parameterName = "id"): ?int
    {
        if ($id === null) {
            if ($required) {
                $this->brb->addError($parameterName, BPC::REQUIRED);
            }
            return null;
        }

        if (($id = mate_sanitize_int($id)) === false) {
            $this->brb->addError($parameterName, BPC::INCORRECT, BPC::DATA_INCORRECT_INTEGER);
            return 0;
        }

        if ($this->repository->selectById($id) === null) {
            $this->brb->addError($parameterName, BPC::NOT_FOUND);
            return 0;
        }

        return $id;
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
        }

        if ($size <= 0) {
            $size = MATE_THEME_API_DEFAULT_PAGE_SIZE;
        }

        if ($size > MATE_THEME_API_MAX_PAGE_SIZE) {
            $size = MATE_THEME_API_MAX_PAGE_SIZE;
        }

        return $size;
    }


    public function name(mixed $name, string $parameterName = "name"): string
    {
        if ($name === null) {
            $this->brb->addError($parameterName, BPC::REQUIRED);
            return "";
        }

        if (($name = mate_sanitize_string($name)) === false) {
            $this->brb->addError($parameterName, BPC::INCORRECT, BPC::DATA_INCORRECT_STRING);
            return "";
        }

        if (strlen($name) === 0) {
            $this->brb->addError($parameterName, BPC::REQUIRED);
            return "";
        }

        if (strlen($name) > MATE_THEME_API_MAX_NAME_LENGTH) {
            $this->brb->addError($parameterName, BPC::STRING_MAX, BPC::DATA_STRING_MAX_NAME);
            return "";
        }

        return $name;
    }


    public function description(mixed $description): string
    {
        $parameterName = "description";

        if ($description === null) {
            $this->brb->addError($parameterName, BPC::REQUIRED);
            return "";
        }

        if (($description = mate_sanitize_string($description)) === false) {
            $this->brb->addError($parameterName, BPC::INCORRECT, BPC::DATA_INCORRECT_STRING);
            return "";
        }

        if (strlen($description) > MATE_THEME_API_MAX_DESCRIPTION_LENGTH) {
            $this->brb->addError($parameterName, BPC::STRING_MAX, BPC::DATA_STRING_MAX_DESCRIPTION);
            return "";
        }

        return $description;
    }
}
