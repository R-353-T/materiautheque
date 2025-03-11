<?php

namespace mate\controller;

use mate\abstract\clazz\Controller;
use mate\repository\TemplateRepository;
use mate\schema\TemplateSchema;
use mate\util\RestPermission;
use mate\util\SqlSelectQueryOptions;
use WP_REST_Request;
use WP_REST_Server;

class TemplateController extends Controller
{
    protected string $endpoint = "template";
    protected array $routes = [
        "list"  => [
            "method"        => WP_REST_Server::READABLE,
            "permission"    => RestPermission::CONTRIBUTOR
        ],
        "get"   => [
            "method"        => WP_REST_Server::READABLE,
            "permission"    => RestPermission::CONTRIBUTOR
        ],
        "update"    => [
            "method"        => WP_REST_Server::EDITABLE,
            "permission"    => RestPermission::CONTRIBUTOR
        ]
    ];

    private readonly TemplateSchema $schema;
    private readonly TemplateRepository $repository;

    public function __construct()
    {
        $this->schema = TemplateSchema::inject();
        $this->repository = TemplateRepository::inject();
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
        $sqlOptions = new SqlSelectQueryOptions();
        $sqlOptions->orderBy("name", "ASC");
        $data = $this->repository->selectAll($sqlOptions);
        return $this->ok($data);
    }

    public function get(WP_REST_Request $request)
    {
        return is_wp_error(($id = $this->schema->get($request)))
            ? $id
            : $this->ok($this->repository->selectById($id));
    }
}
