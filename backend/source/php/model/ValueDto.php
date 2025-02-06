<?php

namespace mate\model;

use mate\repository\TypeRepository;

class ValueDto
{
    public static function build(int $typeId, object $data)
    {
        /** @var TypeRepository */
        $repository = TypeRepository::inject();
        $column = $repository->selectById($typeId)->column;

        $valueDto = new ValueDto();
        $valueDto->id = $data->id;
        $valueDto->value = $data->$column;

        return $valueDto;
    }

    public static function buildList(int $typeId, array $data)
    {
        return array_map(
            function ($value) use ($typeId) {
                return ValueDto::build($typeId, $value);
            },
            $data
        );
    }

    public static function parse(object $data)
    {
        $valueDto = new ValueDto();
        $valueDto->id = $data->id;
        $valueDto->value = $data->value;

        return $valueDto;
    }

    public static function parseList(array $data)
    {
        return array_map([ValueDto::class, "parse"], $data);
    }

    public ?int $id;
    public mixed $value;

    public ?int $unitValueId;
    public ?int $fieldId;
}
