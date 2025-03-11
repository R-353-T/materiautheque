<?php

namespace mate\controller;

use mate\abstract\clazz\Controller;
use mate\repository\GroupRepository;
use mate\schema\GroupSchema;
use mate\util\RestPermission;
use mate\util\SqlSelectQueryOptions;
use PDO;
use WP_REST_Request;
use WP_REST_Server;

class GroupController extends Controller
{
    protected string $endpoint = "group";
    protected array $routes = [
        "create" => [
            "method"        => WP_REST_Server::CREATABLE,
            "permission"    => RestPermission::EDITOR
        ],
        "update" => [
            "method"        => WP_REST_Server::EDITABLE,
            "permission"    => RestPermission::EDITOR
        ],
        "list" => [
            "method"        => WP_REST_Server::READABLE,
            "permission"    => RestPermission::SUBSCRIBER
        ],
        "get" => [
            "method"        => WP_REST_Server::READABLE,
            "permission"    => RestPermission::SUBSCRIBER
        ],
        "delete" => [
            "method"        => WP_REST_Server::DELETABLE,
            "permission"    => RestPermission::EDITOR
        ]
    ];

    private readonly GroupSchema $schema;
    private readonly GroupRepository $repository;

    public function __construct()
    {
        $this->schema = GroupSchema::inject();
        $this->repository = GroupRepository::inject();
    }

    public function create(WP_REST_Request $request)
    {
        return is_wp_error($model = $this->schema->create($request))
            || is_wp_error($model = $this->repository->insert($model))
            ? $model
            : $this->ok($model);
    }

    public function update(WP_REST_Request $request)
    {
        return is_wp_error($model = $this->schema->update($request))
            || is_wp_error($model = $this->repository->update($model))
            ? $model
            : $this->ok($model);
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

        $sqlOptions->where("templateId", "=", $options["templateId"], PDO::PARAM_INT);

        if ($options["parentId"] !== 0) {
            $sqlOptions->where("parentId", "=", $options["parentId"], PDO::PARAM_INT);
        } else {
            $sqlOptions->whereRaw("parentId IS NULL");
        }

        $sqlOptions->orderBy("position", "ASC");

        $data = $this->repository->selectAll($sqlOptions);
        $total = $this->repository->getPageCount($sqlOptions);
        return $this->page($data, $options["index"], $options["size"], $total);
    }

    public function get(WP_REST_Request $request)
    {
        return is_wp_error(($id = $this->schema->get($request)))
            ? $id
            : $this->ok($this->repository->selectById($id));
    }

    public function delete(WP_REST_Request $request)
    {
        return is_wp_error(($id = $this->schema->delete($request)))
            ? $id
            : $this->ok($this->repository->deleteById($id));
    }
}
