<?php

namespace mate\repository;

use mate\abstract\clazz\Repository;
use mate\error\WPErrorBuilder;
use mate\model\ImageModel;
use mate\service\ImageService;
use mate\SQL;
use mate\util\SqlSelectQueryOptions;
use PDO;
use Throwable;

class ImageRepository extends Repository
{
    protected string $table = "mate_image";
    protected string $model = ImageModel::class;

    private readonly ImageService $service;

    public function __construct()
    {
        parent::__construct();
        $this->service = ImageService::inject();
    }

    public function insert($model): ?object
    {
        $result = null;

        $this->db->transaction();

        try {
            $result = $this->service->upload($model);

            if (is_wp_error($result) === false) {
                $s = $this->db->prepare(SQL::IMAGE_INSERT);
                $s->bindValue(":name", $model->name, PDO::PARAM_STR);
                $s->bindValue(":relative", $model->relative, PDO::PARAM_STR);
                $s->execute();
                $model->id = $this->db->lastInsertId();
                $this->db->commit();
                $result = $this->selectById($model->id, false);
            }
        } catch (Throwable $err) {
            $this->db->rollback();

            if ($result === null) {
                $this->service->delete($model->relative);
            }

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
        $oldModel = $this->selectById($model->id);

        $this->db->transaction();

        try {
            if ($model->file !== null) {
                $uploaded = $this->service->upload($model);
                $result = $uploaded;
            } else {
                $model->relative = $oldModel->relative;
            }

            if (is_wp_error($result) === false) {
                $s = $this->db->prepare(SQL::IMAGE_UPDATE);
                $s->bindValue(":id", $model->id, PDO::PARAM_INT);
                $s->bindValue(":name", $model->name, PDO::PARAM_STR);
                $s->bindValue(":relative", $model->relative, PDO::PARAM_STR);
                $s->execute();

                $deleted = $model->file !== null
                    ? $this->service->delete($oldModel->relative)
                    : null;

                if (is_wp_error($deleted) === false) {
                    $this->db->commit();
                    $result = $this->selectById($model->id, false);
                } else {
                    $this->db->rollback();
                    $result = $deleted;
                }
            }
        } catch (Throwable $err) {
            $this->db->rollback();

            if ($model->file !== null && $uploaded === null) {
                $this->service->delete($model->relative);
            }

            $result = WPErrorBuilder::internalServerError(
                $err->getMessage(),
                $err->getTraceAsString()
            );
        }

        return $result;
    }

    public function selectById(int $id, bool $cache = true): ?object
    {
        $model = parent::selectById($id, $cache);

        if ($model !== null) {
            $this->formatImage($model);
        }

        return $model;
    }

    public function selectAll(?SqlSelectQueryOptions $options = null): array
    {
        $list = parent::selectAll($options);

        foreach ($list as $image) {
            $this->formatImage($image);
        }

        return $list;
    }

    private function formatImage(ImageModel $image)
    {
        $image->url = site_url($image->relative);
        unset($image->file);
    }
}
