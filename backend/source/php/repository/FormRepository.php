<?php

namespace mate\repository;

use mate\abstract\clazz\Repository;
use mate\error\WPErrorBuilder;
use mate\model\FormModel;
use mate\SQL;
use PDO;
use Throwable;
use WP_Error;

class FormRepository extends Repository
{
    protected string $table = "mate_form";
    protected string $model = FormModel::class;

    private readonly FormValueRepository $valueRepository;

    public function __construct()
    {
        parent::__construct();
        $this->valueRepository = FormValueRepository::inject();
    }

    public function insert($model): ?object
    {
        $result = null;

        try {
            $this->db->transaction();
            $s = $this->db->prepare(SQL::FORM_INSERT);
            $s->bindValue(":name", $model->name, PDO::PARAM_STR);
            $s->bindValue(":templateId", $model->templateId, PDO::PARAM_INT);
            $s->execute();

            $model->id = $this->db->lastInsertId();

            foreach ($model->valueList as $value) {
                $value->formId = $model->id;
                $this->valueRepository->insert($value);
            }

            $this->db->commit();
            $result = $this->selectById($model->id, false);
        } catch (Throwable $err) {
            $this->db->rollback();
            $result = WPErrorBuilder::internalServerError(
                $err->getMessage(),
                $err->getTraceAsString()
            );
        }

        return $result;
    }

    public function update($model): ?object
    {
        $result = null;
        $previousModel = $this->selectById($model->id);
        $getId = fn($v) => $v->id;
        $newValueIdList = array_map($getId, $model->valueList);
        $previousValueIdList = array_map($getId, $previousModel->valueList);
        $toDeleteIdList = array_filter($previousValueIdList, fn ($id) => !in_array($id, $newValueIdList));

        try {
            $this->db->transaction();
            $s = $this->db->prepare(SQL::FORM_UPDATE);
            $s->bindValue(":name", $model->name, PDO::PARAM_STR);
            $s->bindValue(":templateId", $model->templateId, PDO::PARAM_INT);
            $s->bindValue(":id", $model->id, PDO::PARAM_INT);
            $s->execute();

            foreach ($model->valueList as $value) {
                $value->formId = $model->id;
                if ($value->id !== null) {
                    $this->valueRepository->update($value);
                } else {
                    $this->valueRepository->insert($value);
                }
            }

            array_map([$this->valueRepository, "deleteById"], $toDeleteIdList);
            $this->db->commit();
            $result = $this->selectById($model->id, false);
        } catch (Throwable $err) {
            $this->db->rollback();
            $result = WPErrorBuilder::internalServerError(
                $err->getMessage(),
                $err->getTraceAsString()
            );
        }

        return $result;
    }

    public function selectById(int $id, bool $cache = true): ?FormModel
    {
        $m = parent::selectById($id, $cache);

        if ($m !== null) {
            $m->valueList = $this->valueRepository->selectByFormId($m->id);
        }

        return $m;
    }

    public function containsValueById(int $id, int $valueId): bool
    {
        $model = $this->selectById($id);

        return $model !== null
            ? count(array_filter($model->valueList, fn($v) => $v->id === $valueId)) > 0
            : false;
    }


    public function deleteById(int $id): bool|WP_Error
    {
        try {
            $this->db->transaction();
            $this->valueRepository->deleteByFormId($id);
            $result = parent::deleteById($id);
            $this->db->commit();

            return $result;
        } catch (Throwable $err) {
            $this->db->rollback();
            return WPErrorBuilder::internalServerError($err->getMessage(), $err->getTraceAsString());
        }
    }
}
