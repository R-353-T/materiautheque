<?php

namespace mate\repository;

use mate\abstract\clazz\Repository;
use mate\model\EnumeratorValueModel;
use mate\SQL;
use mate\util\SqlSelectQueryOptions;
use PDO;
use WP_Error;

class EnumeratorValueRepository extends Repository
{
    protected string $table = "mate_enumerator_value";
    protected string $model = EnumeratorValueModel::class;

    private readonly FormValueRepository $formValueRepository;

    public function __construct()
    {
        parent::__construct();
        $this->formValueRepository = FormValueRepository::inject();
    }

    public function insert($model): ?object
    {
        $s = $this->db->prepare(SQL::ENUMERATOR_VALUE_INSERT);
        $s->bindValue(":enumeratorId", $model->enumeratorId, PDO::PARAM_INT);
        $s->bindValue(":position", $model->position, PDO::PARAM_INT);
        $s->bindValue(":text", $model->text, PDO::PARAM_STR);
        $s->bindValue(":number", $model->number, PDO::PARAM_STR);
        $s->bindValue(":date", $model->date, PDO::PARAM_STR);
        $s->execute();
        $model->id = $this->db->lastInsertId();
        return $model;
    }

    public function update($model): ?object
    {
        $s = $this->db->prepare(SQL::ENUMERATOR_VALUE_UPDATE);
        $s->bindValue(":enumeratorId", $model->enumeratorId, PDO::PARAM_INT);
        $s->bindValue(":position", $model->position, PDO::PARAM_INT);
        $s->bindValue(":text", $model->text, PDO::PARAM_STR);
        $s->bindValue(":number", $model->number, PDO::PARAM_STR);
        $s->bindValue(":date", $model->date, PDO::PARAM_STR);
        $s->bindValue(":id", $model->id, PDO::PARAM_INT);
        $s->execute();
        return $model;
    }

    public function selectByEnumeratorId(int $enumeratorId): array
    {
        $sqlOptions = new SqlSelectQueryOptions();
        $sqlOptions->where("enumeratorId", "=", $enumeratorId, PDO::PARAM_INT);
        $sqlOptions->orderBy("position", "ASC");
        return $this->selectAll($sqlOptions);
    }

    public function deleteByEnumeratorId(int $enumeratorId): void
    {
        $s = $this->db->prepare(SQL::ENUMERATOR_VALUE_DELETE_BY_ENUMERATOR_ID);
        $s->bindValue(":enumeratorId", $enumeratorId, PDO::PARAM_INT);
        $s->execute();
    }

    public function deleteById(int $id): bool|WP_Error
    {
        $this->formValueRepository->deleteByEnumeratorValueId($id);
        return parent::deleteById($id);
    }
}
