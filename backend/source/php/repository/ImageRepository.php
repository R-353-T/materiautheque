<?php

namespace mate\repository;

use mate\abstract\clazz\Repository;
use mate\error\WPErrorBuilder;
use mate\model\ImageModel;
use mate\service\ImageService;
use PDO;
use Throwable;

class ImageRepository extends Repository
{
    protected string $table = "mate_image";
    protected string $model = ImageModel::class;

    private ImageService $service;

    public function __construct()
    {
        parent::__construct();
        $this->service = ImageService::inject();
    }

    public function insert($model): ?object
    {
        $this->db->transaction();
        $uploadErr = null;
        $q = <<<SQL
        INSERT INTO {$this->table} (`name`, `relative`)
        VALUES (:name, :relative)
        SQL;

        try {
            $uploadErr = $this->service->upload($model);
            if (is_wp_error($uploadErr)) {
                return $uploadErr;
            } else {
                $s = $this->db->prepare($q);
                $s->bindValue(":name", $model->name, PDO::PARAM_STR);
                $s->bindValue(":relative", $model->relative, PDO::PARAM_STR);
                $s->execute();
                $model->id = $this->db->lastInsertId();
                $this->db->commit();
                return $this->selectById($model->id);
            }
        } catch (Throwable $err) {
            $this->db->rollback();

            if ($uploadErr === null) {
                $this->service->delete($model->relative);
            }

            echo "???D";
            return WPErrorBuilder::internalServerError($err->getMessage(), $err->getTraceAsString());
        }
    }

    public function update($model): ?object
    {
        $this->db->transaction();
        $previousModel = $this->selectById($model->id);
        $uploadErr = null;
        $deleteErr = null;
        $q = <<<SQL
        UPDATE {$this->table}
        SET `name` = :name, `relative` = :relative
        WHERE `id` = :id
        SQL;

        try {
            if ($model->file !== null) {
                $uploadErr = $this->service->upload($model);
            } else {
                $model->relative = $previousModel->relative;
            }

            if (is_wp_error($uploadErr)) {
                return $uploadErr;
            } else {
                $s = $this->db->prepare($q);
                $s->bindValue(":id", $model->id, PDO::PARAM_INT);
                $s->bindValue(":name", $model->name, PDO::PARAM_STR);
                $s->bindValue(":relative", $model->relative, PDO::PARAM_STR);
                $s->execute();

                if ($model->file !== null) {
                    $deleteErr = $this->service->delete($previousModel->relative);
                }

                if (is_wp_error($deleteErr)) {
                    $this->db->rollback();
                    return $deleteErr;
                } else {
                    $this->db->commit();
                    return $this->selectById($model->id);
                }
            }
        } catch (Throwable $err) {
            $this->db->rollback();

            if ($model->file !== null && $uploadErr === null) {
                $this->service->delete($model->relative);
            }

            return WPErrorBuilder::internalServerError($err->getMessage(), $err->getTraceAsString());
        }
    }

    public function selectById(int $id, bool $cache = true): ?object
    {
        $model = parent::selectById($id, $cache);
        $model->url = site_url($model->relative);
        unset($model->file);
        return $model;
    }
}
