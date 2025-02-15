<?php

namespace mate\controller;

use mate\abstract\clazz\Controller;
use mate\repository\FormRepository;
use mate\schema\FormSchema;
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

    public function __construct()
    {
        $this->schema = FormSchema::inject();
        $this->repository = FormRepository::inject();
    }

    public function create(WP_REST_Request $req)
    {
        $model = $this->schema->create($req);

        if (is_wp_error($model) === false) {
            $model = $this->repository->insert($model);

            if (is_wp_error($model) === false) {
                // $model->valueList = ValueDto::parseList($model->valueList);
                return $this->ok($model);
            }
        }

        return $model;
    }

    public function update(WP_REST_Request $req)
    {
        $model = $this->schema->update($req);

        if (is_wp_error($model) === false) {
            $model = $this->repository->update($model);

            if (is_wp_error($model) === false) {
                // $model->valueList = ValueDto::parseList($model->valueList);
                return $this->ok($model);
            }
        }

        return $model;
    }

    public function list(WP_REST_Request $req)
    {
        $options = $this->schema->list($req);

        if (is_wp_error($options) === false) {
            $sqlOptions = new SqlSelectQueryOptions($options["index"], $options["size"]);

            $sqlOptions->where("templateId", "=", $options["templateId"], PDO::PARAM_INT);

            if ($options["search"] !== null) {
                $searchQuery = 'LOWER(`name`) LIKE LOWER(CONCAT("%", :_search, "%"))';
                $sqlOptions->whereRaw(
                    $searchQuery,
                    [[":_search", $options["search"], PDO::PARAM_STR]]
                );
            }

            $data = $this->repository->selectAll($sqlOptions);
            $total = $this->repository->getPageCount($sqlOptions);
            return $this->page($data, $options["index"], $options["size"], $total);
        }

        return $options;
    }

    public function get(WP_REST_Request $req)
    {
        $model = $this->schema->get($req);

        if (is_wp_error($model) === false) {
            $model = $this->repository->selectById($model->id);
            // $model->valueList = ValueDto::parseList($model->valueList);
            return $this->ok($model);
        }

        return $model;
    }

    public function delete(WP_REST_Request $req)
    {
        $model = $this->schema->delete($req);

        if (is_wp_error($model) === false) {
            $deleted = $this->repository->deleteById($model->id);
            return $this->ok($deleted);
        }

        return $model;
    }
}
