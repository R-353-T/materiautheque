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
        $model = $this->schema->create($request);

        if (is_wp_error($model) === false) {
            $model = $this->repository->insert($model);

            if (is_wp_error($model) === false) {
                $model->valueList = ValueDto::parseList($model->valueList);
                return $this->ok($model);
            }
        }

        return $model;
    }

    public function update(WP_REST_Request $request)
    {
        $model = $this->schema->update($request);

        if (is_wp_error($model) === false) {
            $model = $this->repository->update($model);

            if (is_wp_error($model) === false) {
                $model->valueList = ValueDto::parseList($model->valueList);
                return $this->ok($model);
            }
        }

        return $model;
    }

    public function list(WP_REST_Request $request)
    {
        $options = $this->schema->list($request);

        if (is_wp_error($options) === false) {
            $sqlOptions = new SqlSelectQueryOptions($options["index"], $options["size"]);

            if ($options["search"] !== null) {
                $searchQuery = 'LOWER(`name`) LIKE LOWER(CONCAT("%", :_search, "%"))';
                $sqlOptions->whereRaw(
                    $searchQuery,
                    [[":_search", $options["search"], PDO::PARAM_STR]]
                );
            }

            $sqlOptions->orderBy("name", "ASC");

            $data = $this->repository->selectAll($sqlOptions);
            $total = $this->repository->getPageCount($sqlOptions);
            return $this->page($data, $options["index"], $options["size"], $total);
        }

        return $options;
    }

    public function get(WP_REST_Request $request)
    {
        $model = $this->schema->get($request);

        if (is_wp_error($model) === false) {
            $model = $this->repository->selectById($model->id);
            $model->valueList = ValueDto::parseList($model->valueList);
            return $this->ok($model);
        }

        return $model;
    }

    public function delete(WP_REST_Request $request)
    {
        $model = $this->schema->delete($request);

        if (is_wp_error($model) === false) {
            $deleted = $this->repository->deleteById($model->id);

            if (is_wp_error($deleted) === true) {
                return $deleted;
            } else {
                return $this->ok($deleted);
            }
        }

        return $model;
    }
}
