<?php

namespace mate\service;

use DateTime;
use mate\abstract\clazz\Service;
use mate\enumerator\Type;
use mate\model\FormModel;
use mate\model\FormValueModel;
use mate\repository\FieldRepository;
use mate\repository\TypeRepository;

class FormService extends Service
{
    private readonly TypeRepository $typeRepository;
    private readonly FieldRepository $fieldRepository;

    public function __construct()
    {
        $this->typeRepository = TypeRepository::inject();
    }

    public function flatRequestValues(array $groups, array &$result = []): array
    {
        foreach ($groups as $group) {
            if (isset($group['childGroupList'])) {
                $this->flatRequestValues($group['childGroupList'], $result);
            }

            if (isset($group['valueList'])) {
                foreach ($group['valueList'] as $value) {
                    if (!isset($result[$value['fieldId']])) {
                        $result[$value['fieldId']] = [];
                    }

                    $result[$value['fieldId']][] = $value;
                }
            }
        }

        return $result;
    }

    public function buildModelFromData(array $data)
    {
        $model = new FormModel();

        if (isset($data['id'])) {
            $model->id = $data['id'];
        }

        $model->name = $data['name'];

        $valueList = $data['childGroupList'];
        $model->valueList = [];

        foreach ($valueList as $valueDTO) {
            $valueModel = new FormValueModel();
            $VALUE = $$valueDTO['value'];

            $field = $this->fieldRepository->selectById($valueDTO['fieldId']);
            $valueModel->fieldId = $valueDTO['fieldId'];

            $type = $this->typeRepository->selectById($field->typeId);
            $column = $type->column;

            if ($type->id === Type::DATE) {
                $valueModel->$column = DateTime::createFromFormat(MATE_DATE_FORMAT, $VALUE);
            } else {
                $valueModel->$column = $VALUE;
            }

            if (isset($valueDTO['unit'])) {
                $valueModel->unitValueId = $valueDTO['unit'];
            }

            $model->valueList[] = $valueModel;
        }

        return $model;
    }
}
