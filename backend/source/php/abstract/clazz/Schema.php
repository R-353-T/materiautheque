<?php

namespace mate\abstract\clazz;

use mate\abstract\trait\Singleton;
use mate\error\WPErrorBuilder;

class Schema
{
    use Singleton;

    public function returnModel(array $data, string $className, array &$errors)
    {
        if (count($errors) > 0) {
            return WPErrorBuilder::badRequestError($errors);
        } else {
            $model = new $className();

            foreach ($data as $key => $value) {
                if (property_exists($model, $key)) {
                    $model->$key = $value;
                }
            }

            return $model;
        }
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
