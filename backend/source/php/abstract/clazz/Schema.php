<?php

namespace mate\abstract\clazz;

use mate\error\BadRequestBuilder;
use mate\error\WPErrorBuilder;

class Schema extends Service
{
    protected readonly BadRequestBuilder $brb;

    public function __construct()
    {
        $this->brb = new BadRequestBuilder();
    }

    public function returnData(array $data, array &$errors)
    {
        return (
            count($errors) > 0
            ? WPErrorBuilder::badRequestError($errors)
            : $data
        );
    }
}
