<?php

namespace mate\controller;

use mate\abstract\clazz\Controller;
use mate\model\ValueDto;
use mate\repository\UnitRepository;
use mate\schema\UnitSchema;
use mate\util\RestPermission;
use mate\util\SqlSelectQueryOptions;
use PDO;
use WP_REST_Request;
use WP_REST_Server;

class UnitController extends Controller
{
    protected string $endpoint = "unit";
    protected array $routes = [
        "create" => [
            "method" => WP_REST_Server::CREATABLE,
            "permission" => RestPermission::EDITOR
        ],
        "update" => [
            "method" => WP_REST_Server::EDITABLE,
            "permission" => RestPermission::EDITOR
        ],
        "list" => [
            "method" => WP_REST_Server::READABLE,
            "permission" => RestPermission::SUBSCRIBER
        ],
        "get" => [
            "method" => WP_REST_Server::READABLE,
            "permission" => RestPermission::SUBSCRIBER
        ],
        "delete" => [
            "method" => WP_REST_Server::DELETABLE,
            "permission" => RestPermission::EDITOR
        ]
    ];

    private readonly UnitSchema $schema;
    private readonly UnitRepository $repository;

    public function __construct()
    {
        $this->schema = UnitSchema::inject();
        $this->repository = UnitRepository::inject();
    }

    public function create(WP_REST_Request $request)
    {
        if (
            is_wp_error($model = $this->schema->create($request))
            || is_wp_error($model = $this->repository->insert($model))
        ) {
            return $model;
        } else {
            $model->valueList = ValueDto::parseList($model->valueList);
            return $this->ok($model);
        }
    }

    public function update(WP_REST_Request $request)
    {
        if (
            is_wp_error($model = $this->schema->update($request))
            || is_wp_error($model = $this->repository->update($model))
        ) {
            return $model;
        } else {
            $model->valueList = ValueDto::parseList($model->valueList);
            return $this->ok($model);
        }
    }

    public function list(WP_REST_Request $request)
    {
        if (is_wp_error($options = $this->schema->list($request))) {
            return $options;
        }

        $sqlOptions = new SqlSelectQueryOptions($options["index"], $options["size"]);

        if ($options["search"] !== null) {
            $sqlOptions->whereRaw(
                'LOWER(`name`) LIKE LOWER(CONCAT("%", :_search, "%"))',
                [[":_search", $options["search"], PDO::PARAM_STR]]
            );
        }

        $sqlOptions->orderBy("name", "ASC");

        $data = $this->repository->selectAll($sqlOptions);
        $total = $this->repository->getPageCount($sqlOptions);
        return $this->page($data, $options["index"], $options["size"], $total);
    }

    public function get(WP_REST_Request $request)
    {
        if (is_wp_error($id = $this->schema->get($request))) {
            return $id;
        } else {
            $model = $this->repository->selectById($id);
            $model->valueList = ValueDto::parseList($model->valueList);
            return $this->ok($model);
        }
    }

    public function delete(WP_REST_Request $request)
    {
        return is_wp_error(($id = $this->schema->delete($request)))
            ? $id
            : $this->ok($this->repository->deleteById($id));
    }
}
