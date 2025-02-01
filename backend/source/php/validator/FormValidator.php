<?php

namespace mate\validator;

use mate\abstract\clazz\Validator;
use mate\error\SchemaError;
use mate\model\EnumeratorModel;
use mate\model\FieldModel;
use mate\model\GroupModel;
use mate\model\TemplateModel;
use mate\model\UnitModel;
use mate\repository\EnumeratorRepository;
use mate\repository\FieldRepository;
use mate\repository\FormRepository;
use mate\repository\GroupRepository;
use mate\repository\TemplateRepository;
use mate\repository\TypeRepository;
use mate\repository\UnitRepository;
use mate\service\FormService;
use WP_REST_Request;

class FormValidator extends Validator
{
    private readonly GroupValidator $groupValidator;
    private readonly FieldValidator $fieldValidator;
    private readonly TypeValueValidator $typeValidator;

    private readonly GroupRepository $groupRepository;
    private readonly FieldRepository $fieldRepository;
    private readonly TypeRepository $typeRepository;
    private readonly EnumeratorRepository $enumeratorRepository;
    private readonly UnitRepository $unitRepository;
    private readonly TemplateRepository $templateRepository;

    private readonly FormService $formService;

    public function __construct()
    {
        $this->groupValidator = GroupValidator::inject();
        $this->fieldValidator = FieldValidator::inject();
        $this->typeValidator = TypeValueValidator::inject();

        $this->repository = FormRepository::inject();
        $this->typeRepository = TypeRepository::inject();
        $this->groupRepository = GroupRepository::inject();
        $this->fieldRepository = FieldRepository::inject();
        $this->enumeratorRepository = EnumeratorRepository::inject();
        $this->unitRepository = UnitRepository::inject();
        $this->templateRepository = TemplateRepository::inject();

        $this->formService = FormService::inject();
    }

    public function validChildGroupList(WP_REST_Request $req, array &$errors): array
    {
        if ($this->hasErrors($errors, "id", "templateId")) {
            return [];
        }

        $templateId     = (int) $req->get_param("templateId");
        $childGroupList = $req->get_param("childGroupList");
        $childGroupList = mate_sanitize_array($childGroupList);

        if ($childGroupList === false) {
            $errors[] = SchemaError::paramIncorrectType("childGroupList", "array");
            return [];
        }

        foreach ($childGroupList as $groupIndex => $group) {
            $gErrors = SchemaError::paramGroupError("childGroupList", $groupIndex);
            $this->validGroup($templateId, $group, $gErrors["errors"]);

            if (count($gErrors["errors"]) > 0) {
                $errors[] = $gErrors;
            }
        }

        // *********************************** //
        // ** COMPARE TEMPLATE / REQUEST    ** //
        // *********************************** //

        if (count($errors) > 0) {
            return [];
        }

        /** @var TemplateModel */
        $template = $this->templateRepository->selectById($templateId);
        $valueDtoHashMap = $this->formService->flatRequestValues($childGroupList);

        foreach ($template->childGroupList as $tCG) {
            $tErrors = SchemaError::paramGroupError("__TEMPLATE__", $tCG->id);
            $this->compareGroup($tCG, $valueDtoHashMap, $tErrors["errors"]);

            if (count($tErrors["errors"]) > 0) {
                $errors[] = $tErrors;
            }
        }

        return $valueDtoHashMap;
    }

    private function validGroup(int $templateId, mixed $group, array &$errors): void
    {
        if ($group === null) {
            $errors[] = SchemaError::paramRequired("__MAIN__");
            return;
        }

        $group = mate_sanitize_array($group);

        if ($group === false) {
            $errors[] = SchemaError::paramIncorrectType("__MAIN__", "array");
            return;
        }

        if (!isset($group['id'])) {
            $errors[] = SchemaError::paramRequired("id");
            return;
        }

        $model = $this->groupRepository->selectById($group['id']);

        if ($model->templateId !== $templateId) {
            // todo - remove custom error
            $errors[] = [
                "name" => "id",
                "code" => "param_template_mismatch"
            ];
            return;
        }

        $req = new WP_REST_Request();
        $req->set_param("id", $group['id']);
        $this->groupValidator->validId($req, $errors);

        if ($this->hasError($errors, "id")) {
            return;
        }

        // *********************************** //
        // ** GROUP RECURSIVE VALIDATION    ** //
        // *********************************** //

        if (isset($group['childGroupList'])) {
            $childGroupList = mate_sanitize_array($group['childGroupList']);

            if ($childGroupList === false) {
                $errors[] = SchemaError::paramIncorrectType("childGroupList", "array");
                return;
            }

            foreach ($childGroupList as $sGroupIndex => $sGroup) {
                $sGErrors = SchemaError::paramGroupError("childGroupList", $sGroupIndex);
                $this->validGroup($templateId, $sGroup, $sGErrors["errors"]);

                if (count($sGErrors["errors"]) > 0) {
                    $errors[] = $sGErrors;
                }
            }
        }

        // *********************************** //
        // ** VALUE VALIDATION              ** //
        // *********************************** //

        if (isset($group['valueList'])) {
            $valueList = mate_sanitize_array($group['valueList']);

            if ($valueList === false) {
                $errors[] = SchemaError::paramIncorrectType("valueList", "array");
                return;
            }

            foreach ($valueList as $valueIndex => $value) {
                $vErrors = SchemaError::paramGroupError("valueList", $valueIndex);
                $this->validValue($templateId, $value, $vErrors["errors"]);

                if (count($vErrors["errors"]) > 0) {
                    $errors[] = $vErrors;
                }
            }
        }
    }

    private function validValue(int $templateId, mixed $value, array &$errors): void
    {
        if ($value === null) {
            $errors[] = SchemaError::paramRequired("__MAIN__");
            return;
        }

        $value = mate_sanitize_array($value);

        if ($value === false) {
            $errors[] = SchemaError::paramIncorrectType("__MAIN__", "array");
            return;
        }

        $fr = new WP_REST_Request();
        $fr->set_param("fieldId", $value['fieldId']);
        $valueFieldId = $this->fieldValidator->validId($fr, $errors, 'fieldId');

        if ($this->hasError($errors, "fieldId")) {
            return;
        }

        $fieldModel = $this->fieldRepository->selectById($valueFieldId);
        $groupModel = $this->groupRepository->selectById($fieldModel->groupId);

        if ($groupModel->templateId !== $templateId) {
            // todo - remove custom error
            $errors[] = [
                "name" => "id",
                "code" => "param_template_mismatch"
            ];
            return;
        }

        if (!isset($value['value'])) {
            $errors[] = SchemaError::paramRequired("value");
            return;
        }

        if ($value['value'] === null) {
            return;
        } else {
            $this->validTypeValue($fieldModel, $value, $errors);
            $this->validEnumeratorValue($fieldModel, $value, $errors);
            $this->validUnitValue($fieldModel, $value, $errors);
        }
    }

    private function validTypeValue(FieldModel $field, mixed $value, array &$errors): void
    {
        if ($field->typeId !== null) {
            $type = $this->typeRepository->selectById($field->typeId);
            $this->typeValidator->validValue($type, $value["value"], $errors, "value");
        }
    }

    private function validEnumeratorValue(FieldModel $field, mixed $value, array &$errors): void
    {
        if ($field->enumeratorId !== null) {
            if ($value['value'] === null) {
                $errors[] = SchemaError::paramRequired("value");
                return;
            }

            $vint = mate_sanitize_int($value);

            if ($vint === false || $vint === 0) {
                $errors[] = SchemaError::paramIncorrectType("value", "number");
                return;
            }

            /** @var EnumeratorModel */
            $enumerator = $this->enumeratorRepository->selectById($field->enumeratorId);
            $idList = array_map(fn($v) => $v->id, $enumerator->valueList);

            if (!in_array($vint, $idList)) {
                $errors[] = SchemaError::paramNotForeignOf("value", $enumerator->name);
                return;
            }
        }
    }

    private function validUnitValue(FieldModel $field, mixed $value, array &$errors): void
    {
        if ($field->unitId !== null) {
            if ($value['unit'] === null) {
                $errors[] = SchemaError::paramRequired("unit");
                return;
            }

            $vint = mate_sanitize_int($value);

            if ($vint === false || $vint === 0) {
                $errors[] = SchemaError::paramIncorrectType("unit", "number");
                return;
            }

            /** @var UnitModel */
            $unit = $this->unitRepository->selectById($field->unitId);
            $idList = array_map(fn($v) => $v->id, $unit->valueList);

            if (!in_array($vint, $idList)) {
                $errors[] = SchemaError::paramNotForeignOf("unit", $unit->name);
                return;
            }
        }
    }

    private function compareGroup(GroupModel $templateGroup, mixed $valueHashMap, array &$errors)
    {
        foreach ($templateGroup->fieldList as $field) {
            // IF IS REQUIRED

            if ($field->isRequired) {
                if (!isset($valueHashMap[$field->id])) {
                    $errors[] = SchemaError::paramRequired($field->name);
                } else {
                    $nn = array_filter($valueHashMap[$field->id], fn($v) => $v["value"] !== null);
                    if (count($nn) === 0) {
                        $errors[] = SchemaError::paramRequired($field->name);
                    }
                }
            }

            // IF IS SINGLE

            if (!$field->allowMultipleValues && isset($valueHashMap[$field->id])) {
                if (count($valueHashMap[$field->id]) > 1) {
                    // todo - remove custom error
                    $errors[] = [
                        "name" => $field->name,
                        "code" => "param_single_value"
                    ];
                }
            }
        }
    }
}
