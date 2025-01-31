<?php

namespace mate\repository;

use mate\abstract\clazz\Repository;
use mate\error\WPErrorBuilder;
use mate\model\GroupModel;
use PDO;
use Throwable;

class GroupRepository extends Repository
{
    protected string $model = GroupModel::class;
    protected string $table = "mate_template_group";

    public function insert($model): ?object
    {
        $this->db->transaction();
        $q = <<<SQL
        INSERT INTO {$this->table} (
            `name`,
            `description`,
            `position`,
            `templateId`,
            `parentId`
        ) VALUES (
            :name,
            :description,
            0,
            :templateId,
            :parentId
        )
        SQL;

        try {
            $s = $this->db->prepare($q);
            $s->bindValue(":name", $model->name, PDO::PARAM_STR);
            $s->bindValue(":description", $model->description, PDO::PARAM_STR);
            $s->bindValue(":templateId", $model->templateId, PDO::PARAM_INT);

            if ($model->parentId !== null) {
                $s->bindValue(":parentId", $model->parentId, PDO::PARAM_INT);
            } else {
                $s->bindValue(":parentId", null, PDO::PARAM_INT);
            }

            $s->execute();
            $model->id = $this->db->lastInsertId();

            $this->db->commit();
            return $this->selectById($model->id, false);
        } catch (Throwable $err) {
            $this->db->rollback();
            return WPErrorBuilder::internalServerError($err->getMessage(), $err->getTraceAsString());
        }
    }

    public function update($model): ?object
    {
        $this->db->transaction();
        $q = <<<SQL
        UPDATE {$this->table}
        SET
        `name`          = :name,
        `description`   = :description,
        `parentId`      = :parentId
        WHERE `id` = :id
        SQL;

        try {
            $s = $this->db->prepare($q);
            $s->bindValue(":name", $model->name, PDO::PARAM_STR);
            $s->bindValue(":description", $model->description, PDO::PARAM_STR);

            if ($model->parentId !== null) {
                $s->bindValue(":parentId", $model->parentId, PDO::PARAM_INT);
            } else {
                $s->bindValue(":parentId", null, PDO::PARAM_INT);
            }

            $s->bindValue(":id", $model->id, PDO::PARAM_INT);
            $s->execute();

            if ($model->childGroupList !== null) {
                foreach ($model->childGroupList as $childGroup) {
                    $this->updatePositionById($childGroup->id, $childGroup->position);
                }
            }

            $this->db->commit();
            return $this->selectById($model->id, false);
        } catch (Throwable $err) {
            $this->db->rollback();
            return WPErrorBuilder::internalServerError(
                $err->getMessage(),
                $err->getTraceAsString()
            );
        }
    }

    public function updatePositionById(int $id, int $position)
    {
        $q = <<<SQL
        UPDATE {$this->table}
        SET `position` = :position
        WHERE `id` = :id
        SQL;
        $s = $this->db->prepare($q);
        $s->bindValue(":position", $position, PDO::PARAM_INT);
        $s->bindValue(":id", $id, PDO::PARAM_INT);
        $s->execute();
    }

    public function selectTemplateChildList(int $templateId, bool $recursive = false)
    {
        $output = [];
        $q = <<<SQL
        SELECT * FROM {$this->table}
        WHERE `templateId` = :templateId
        AND `parentId` IS NULL
        SQL;

        $s = $this->db->prepare($q);
        $s->bindValue(":templateId", $templateId, PDO::PARAM_INT);
        $s->execute();

        $groupList = $s->fetchAll(PDO::FETCH_CLASS, $this->model);

        foreach ($groupList as $group) {
            $this->cache->set($group->id, $group);
            $output[] = $group;
            if ($recursive) {
                array_push($output, ...$this->selectGroupChildList($group->id, $recursive));
            }
        }

        return $output;
    }

    public function selectGroupChildList(int $groupId, bool $recursive = false)
    {
        $output = [];
        $q = <<<SQL
        SELECT * FROM {$this->table}
        WHERE `parentId` = :groupId
        ORDER BY `position` ASC, `name` ASC
        SQL;

        $s = $this->db->prepare($q);
        $s->bindValue(":groupId", $groupId);
        $s->execute();

        $groupList = $s->fetchAll(PDO::FETCH_CLASS, $this->model);

        foreach ($groupList as $group) {
            $this->cache->set($group->id, $group);
            $output[] = $group;
            if ($recursive) {
                array_push($output, ...$this->selectGroupChildList($group->id, $recursive));
            }
        }

        return $output;
    }

    public function selectById(int $id, bool $cache = true): ?object
    {
        $model = parent::selectById($id, $cache);

        if ($model !== null) {
            $model->childGroupList = $this->selectGroupChildList($model->id);
        }

        return $model;
    }
}
