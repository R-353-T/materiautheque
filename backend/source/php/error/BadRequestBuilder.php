<?php

namespace mate\error;

use WP_Error;

class BadRequestBuilder
{
    public $parameters = [];

    public function build(): WP_Error
    {
        return new WP_Error(
            "bad_request",
            "Bad Request",
            [
                "status" => 400,
                "parameters" => $this->parameters
            ]
        );
    }

    public function addError(
        string $name,
        string $code,
        array|null $data = null
    ) {
        $this->parameters[] = [
            "code" => $code,
            "name" => $name,
            "data" => $data
        ];
    }

    public function addIndexedError(
        string $name,
        int $index,
        string $code,
        array|null $data = null
    ) {
        if (isset($this->parameters[$name]) === false) {
            $this->parameters[$name] = [];
        }

        $this->parameters[$name][] = [
            "code" => $code,
            "name" => $name,
            "index" => $index,
            "data" => $data
        ];
    }

    public function containErrors(): bool
    {
        return count($this->parameters) > 0;
    }

    public function hasError(...$names)
    {
        foreach ($names as $name) {
            foreach ($this->parameters as $parameter) {
                if ($parameter["name"] === $name) {
                    return true;
                }
            }
        }
        return false;
    }
}
