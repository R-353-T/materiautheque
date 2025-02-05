<?php

namespace mate\validator;

use mate\abstract\clazz\Validator;
use mate\error\SchemaError;
use mate\model\FieldModel;
use mate\model\UnitModel;
use mate\repository\FormRepository;
use mate\repository\UnitRepository;
use mate\service\FormService;
use WP_REST_Request;

class FormValidator extends Validator
{
    private readonly FieldValidator $fieldValidator;
    private readonly UnitValidator $unitValidator;
    private readonly TypeValueValidator $typeValidator;

    private readonly UnitRepository $unitRepository;

    private readonly FormService $formService;

    public function __construct()
    {
        $this->fieldValidator = FieldValidator::inject();
        $this->typeValidator = TypeValueValidator::inject();
        $this->unitValidator = UnitValidator::inject();

        $this->repository = FormRepository::inject();
        $this->unitRepository = UnitRepository::inject();

        $this->formService = FormService::inject();
    }

    public function validChildGroupList(WP_REST_Request $req, array &$errors): array
    {
        if ($this->hasErrors($errors, "id", "templateId")) {
            return [];
        }

        $templateId = (int) $req->get_param("templateId");
        $hashmap = $this->formService->getFieldHashMap($templateId);
        // $id = (int) $req->get_param("id"); // todo add to hashmap current stored values

        $childGroupList = $req->get_param("childGroupList");
        $childGroupList = mate_sanitize_array($childGroupList);

        if ($childGroupList === false) {
            $errors[] = SchemaError::paramIncorrectType("childGroupList", "array");
            return [];
        }

        foreach ($childGroupList as $groupIndex => $group) {
            $gErrors = SchemaError::paramGroupError("childGroupList", $groupIndex);
            $this->validGroup($group, $hashmap, $gErrors["errors"]);

            if (count($gErrors["errors"]) > 0) {
                $errors[] = $gErrors;
            }
        }

        if (count($errors) > 0) {
            return [];
        }

        foreach ($hashmap as $fieldValue) {
            /** @var FieldModel */
            $field = $fieldValue["field"];
            $valueList = $fieldValue["valueList"];

            // Valid multiple

            if ($field->allowMultipleValues === false && count($valueList) > 1) {
                foreach ($valueList as $vI => $v) {
                    $errors[] = [
                        "name"  => $field->name,
                        "fieldId" => $field->id,
                        "valueId" => isset($v["id"]) ? $v["id"] : null,
                        "code"  => "param_field_not_multiple"
                    ];
                }
            }

            // Valid required

            $sV2L = array_map(fn($v2) => $v2["value"] !== null, $valueList);

            if ($field->isRequired === true && count($sV2L) === 0) {
                $errors[] = [
                    "name"  => $field->name,
                    "fieldId" => $field->id,
                    "valueId" => null,
                    "code"  => "param_field_value_required"
                ];
            }

            return $hashmap;
        }
    }

    public function validGroup(mixed $group, array &$hashmap, array &$errors): void
    {
        $ok = mate_sanitize_array($group);

        if ($ok === false) {
            $errors[] = SchemaError::paramIncorrectType("__MAIN__", "array");
            return;
        }

        // Valid values

        if (isset($group['valueList'])) {
            $valueList = mate_sanitize_array($group['valueList']);

            if ($valueList === false) {
                $errors[] = SchemaError::paramIncorrectType("valueList", "array");
                return;
            }

            foreach ($valueList as $valueIndex => $value) {
                $vErrors = SchemaError::paramGroupError("valueList", $valueIndex);
                $this->validValue($value, $hashmap, $vErrors["errors"]);
            }
        }

        // Valid child group

        if (isset($group['childGroupList'])) {
            $groupList = mate_sanitize_array($group['childGroupList']);

            if ($groupList === false) {
                $errors[] = SchemaError::paramIncorrectType("childGroupList", "array");
                return;
            }

            foreach ($groupList as $groupIndex => $group) {
                $gErrors = SchemaError::paramGroupError("childGroupList", $groupIndex);
                $this->validGroup($group, $hashmap, $gErrors["errors"]);

                if (count($gErrors["errors"]) > 0) {
                    $errors[] = $gErrors;
                }
            }
        }
    }

    public function validValue(mixed $value, array &$hashmap, array &$errors): void
    {
        $ok = mate_sanitize_array($value);

        if ($ok === false) {
            $errors[] = SchemaError::paramIncorrectType("__MAIN__", "array");
            return;
        }

        // Validate field id

        if (!isset($value['fieldId'])) {
            $errors[] = SchemaError::paramRequired("fieldId");
            return;
        }

        $fieldId = $this->fieldValidator->validId($value['fieldId'], $errors, "fieldId");

        if (!in_array($fieldId, array_keys($hashmap))) {
            $errors[] = SchemaError::paramFieldNotInTemplate("fieldId");
            return;
        }

        /** @var FieldModel */
        $field = $hashmap[$fieldId]["field"];

        // Valid unit

        if ($field->unitId !== null) {
            if (!isset($value['unitValueId'])) {
                $errors[] = SchemaError::paramRequired("unitValueId");
                return;
            }

            $unitId = $this->unitValidator->validId($value['unitValueId'], $errors, "unitId");

            if ($unitId === 0) {
                $errors[] = SchemaError::paramRequired("unitValueId");
                return;
            }

            /** @var UnitModel */
            $unit = $this->unitRepository->selectById($field->unitId);
            $unitValueIdList = array_map(fn($v) => $v->id, $unit->valueList);

            if (!in_array($unitId, $unitValueIdList)) {
                $errors[] = SchemaError::paramNotForeignOf("unitId", $unit->name);
                return;
            }
        }

        // Valid Value

        if (isset($value['value'])) {
            if ($value['value'] !== null) {
                $this->typeValidator->validFieldValue($field, $value['value'], $errors, "value");

                if (
                    $field->isRequired
                    && count($errors) === 0
                    && is_string($value['value'])
                    && strlen($value['value']) === 0
                ) {
                    $errors[] = SchemaError::paramEmpty("value");
                }
            }
        } else {
            $errors[] = SchemaError::paramRequired("value");
            return;
        }

        $hashmap[$fieldId]["valueList"][] = $value;
    }
}
