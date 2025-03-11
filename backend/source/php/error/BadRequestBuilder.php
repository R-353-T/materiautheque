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
        array|null $data = null,
        ?int $index = null,
        ?string $property = null
    ) {
        $err = [
            "code" => $code,
            "name" => $name,
            "data" => $data
        ];

        if ($index !== null) {
            $err["index"] = $index;
        }

        if ($property !== null) {
            $err["property"] = $property;
        }

        $this->parameters[] = $err;
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
