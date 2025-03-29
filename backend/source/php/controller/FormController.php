<?php

namespace mate\controller;

use mate\abstract\clazz\Controller;
use mate\model\FieldModel;
use mate\model\FormModel;
use mate\model\FormValueModel;
use mate\model\ValueDto;
use mate\repository\FieldRepository;
use mate\repository\FormRepository;
use mate\repository\TypeRepository;
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
    private readonly FieldRepository $fieldRepository;

    public function __construct()
    {
        $this->schema = FormSchema::inject();
        $this->repository = FormRepository::inject();
        $this->fieldRepository = FieldRepository::inject();
    }

    public function create(WP_REST_Request $request)
    {
        if (
            is_wp_error($model = $this->schema->create($request))
            || is_wp_error($model = $this->repository->insert($model))
        ) {
            return $model;
        } else {
            $this->parseValueList($model);
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
            $this->parseValueList($model);
            return $this->ok($model);
        }
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

            $sqlOptions->orderBy("name", "ASC");

            $data = $this->repository->selectAll($sqlOptions);
            $total = $this->repository->getPageCount($sqlOptions);
            return $this->page($data, $options["index"], $options["size"], $total);
        }

        return $options;
    }

    public function get(WP_REST_Request $request)
    {
        if (is_wp_error($id = $this->schema->get($request))) {
            return $id;
        } else {
            $model = $this->repository->selectById($id);
            $this->parseValueList($model);
            return $this->ok($model);
        }
    }

    public function delete(WP_REST_Request $request)
    {
        return is_wp_error(($id = $this->schema->delete($request)))
            ? $id
            : $this->ok($this->repository->deleteById($id));
    }

    private function parseValueList(FormModel $model)
    {
        $model->valueList = array_map(function ($v) {
            /** @var FieldModel */
            $field = $this->fieldRepository->selectById($v->fieldId);
            $r = ValueDto::parseTyped($field->typeId, $v);
            $r->fieldId = $v->fieldId;
            $r->unitValueId = $v->unitValueId;
            return $r;
        }, $model->valueList);
    }
}
