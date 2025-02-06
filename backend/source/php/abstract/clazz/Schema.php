<?php

namespace mate\abstract\clazz;

use mate\error\WPErrorBuilder;

class Schema extends Service
{
    public function returnData(array $data, array &$errors)
    {
        return (
            count($errors) > 0
            ? WPErrorBuilder::badRequestError($errors)
            : $data
        );
    }
}
