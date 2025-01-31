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
        ]
    ];

    private readonly TemplateSchema $schema;
    private readonly TemplateRepository $repository;

    public function __construct()
    {
        $this->schema = TemplateSchema::inject();
        $this->repository = TemplateRepository::inject();
    }

    public function update(WP_REST_Request $req)
    {
        $model = $this->schema->update($req);

        if (is_wp_error($model)) {
            return $model;
        }

        return $this->ok($this->repository->update($model));
    }

    public function list(WP_REST_Request $req)
    {
        $sqlOptions = new SqlSelectQueryOptions();
        $sqlOptions->orderBy("name", "ASC");
        return $this->ok($this->repository->selectAll($sqlOptions));
    }

    public function get(WP_REST_Request $req)
    {
        $model = $this->schema->get($req);

        if (is_wp_error($model)) {
            return $model;
        }

        return $this->ok($this->repository->selectById($model->id));
    }
}
