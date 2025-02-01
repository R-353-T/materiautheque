<?php

namespace mate\controller;

use mate\abstract\clazz\Controller;
use mate\error\WPErrorBuilder;
use mate\repository\FormRepository;
use mate\schema\FormSchema;
use mate\service\FormService;
use mate\util\RestPermission;
use mate\util\SqlSelectQueryOptions;
use PDO;
use WP_REST_Request;
use WP_REST_Server;

class FormController extends Controller
{
    protected string $endpoint = "form";
    protected array $routes = [
        "create" => [
            "method" => WP_REST_Server::CREATABLE,
            "permission" => RestPermission::AUTHOR
        ],
        "update" => [
            "method" => WP_REST_Server::EDITABLE,
            "permission" => RestPermission::AUTHOR
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

    private readonly FormSchema $schema;
    private readonly FormRepository $repository;
    private readonly FormService $service;

    public function __construct()
    {
        $this->schema = FormSchema::inject();
        $this->repository = FormRepository::inject();
        $this->service = FormService::inject();
    }


    public function create(WP_REST_Request $req)
    {
        $model = $this->schema->create($req);

        if (is_wp_error($model)) {
            return $model;
        }

        $model = $this->service->buildModelFromData($model);
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

        if ($options["search"] !== null) {
            $sqlOptions->whereRaw(
                'LOWER(`name`) LIKE LOWER(CONCAT("%", :_search, "%"))',
                [[":_search", $options["search"], PDO::PARAM_STR]]
            );
        }

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
