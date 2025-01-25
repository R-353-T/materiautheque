<?php

namespace mate\controller;

use mate\abstract\clazz\Controller;
use mate\repository\TypeRepository;
use mate\util\RestPermission;
use mate\util\SqlSelectQueryOptions;
use WP_REST_Server;

class TypeController extends Controller
{
    protected string $endpoint = "type";

    protected array $routes = [
        "list" => [
            "method" => WP_REST_Server::READABLE,
            "permission" => RestPermission::SUBSCRIBER
        ]
    ];

    private readonly TypeRepository $typeRepository;

    public function __construct()
    {
        $this->typeRepository = TypeRepository::inject();
    }

    public function list(): array
    {
        $sqlOptions = new SqlSelectQueryOptions();
        $sqlOptions->orderBy("name", "ASC");
        return $this->typeRepository->selectAll($sqlOptions);
    }
}
