<?php

namespace mate\service;

use DateTime;
use mate\abstract\clazz\Service;
use mate\repository\FieldRepository;
use mate\repository\TemplateRepository;
use mate\repository\TypeRepository;

class FormService extends Service
{
    private readonly TypeRepository $typeRepository;
    private readonly FieldRepository $fieldRepository;
    private readonly TemplateRepository $templateRepository;

    public function __construct()
    {
        $this->typeRepository = TypeRepository::inject();
    }

    public function getFieldHashMap(int $templateId)
    {
        $template = $this->fieldRepository->selectFieldListByTemplateId($templateId);

        $result = [];

        foreach ($template as $field) {
            $result[$field->id] = [
                "field" => $field,
                "valueList" => []
            ];
        }

        return $result;
    }
}
