<?php

namespace mate\controller;

use mate\abstract\clazz\Controller;
use mate\error\WPErrorBuilder;
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

    public function create(WP_REST_Request $req)
    {
        $model = $this->schema->create($req);

        if (is_wp_error($model)) {
            return $model;
        }

        $model = $this->repository->insert($model);

        if (is_wp_error($model)) {
            return $model;
        } else {
            return $this->ok($model);
        }
    }

    public function update(WP_REST_Request $req)
    {
        $model = $this->schema->update($req);

        if (is_wp_error($model)) {
            return $model;
        }

        $model = $this->repository->update($model);

        if (is_wp_error($model)) {
            return $model;
        } else {
            return $this->ok($model);
        }
    }

    public function list(WP_REST_Request $req)
    {
        $options = $this->schema->list($req);

        if (is_wp_error($options)) {
            return $options;
        }

        $sqlOptions = new SqlSelectQueryOptions($options["pageIndex"], $options["pageSize"]);

        $sqlOptions->where(
            "templateId",
            "=",
            $options["templateId"],
            PDO::PARAM_INT
        );

        if ($options["parentId"] !== 0) {
            $sqlOptions->where("parentId", "=", $options["parentId"], PDO::PARAM_INT);
        } else {
            $sqlOptions->whereRaw("parentId IS NULL");
        }

        if ($options["search"] !== null) {
            $sqlOptions->whereRaw(
                'LOWER(`name`) LIKE LOWER(CONCAT("%", :_search, "%"))',
                [[":_search", $options["search"], PDO::PARAM_STR]]
            );
        }

        $sqlOptions->orderBy("position", "ASC");
        $total = $this->repository->getPageCount($sqlOptions);
        return ($total < $options["pageIndex"]
            ? WPErrorBuilder::notFoundError()
            : $this->page(
                $this->repository->selectAll($sqlOptions),
                $options["pageIndex"],
                $options["pageSize"],
                $total
            )
        );
    }

    public function get(WP_REST_Request $req)
    {
        $model = $this->schema->get($req);

        if (is_wp_error($model)) {
            return $model;
        }

        return $this->ok($this->repository->selectById($model->id));
    }

    public function delete(WP_REST_Request $req)
    {
        $model = $this->schema->delete($req);

        if (is_wp_error($model)) {
            return $model;
        }

        return $this->ok($this->repository->deleteById($model->id));
    }
}
