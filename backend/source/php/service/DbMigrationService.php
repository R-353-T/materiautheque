<?php

namespace mate\service;

use mate\abstract\clazz\Service;
use mate\model\DbMigrationModel;
use mate\repository\DbMigrationRepository;
use Throwable;

class DbMigrationService extends Service
{
    private readonly DbMigrationRepository $repository;
    private readonly DatabaseService $db;

    private static array $DIRECTORY_LIST = [];

    public static function addDirectory(string $directory)
    {
        self::$DIRECTORY_LIST[] = $directory;
    }

    public function __construct()
    {
        $this->repository = new DbMigrationRepository();
        $this->db = DatabaseService::inject();
    }

    public function upgrade()
    {
        $migrationList = [];

        try {
            $migrationList = $this->repository->selectNameList();
        } catch (Throwable $exception) {
        }

        foreach (self::$DIRECTORY_LIST as $directory) {
            $files = scandir($directory);

            foreach ($files as $file) {
                $fileInfo = pathinfo($file);
                if (!in_array($fileInfo['filename'], $migrationList, true)) {
                    if (strtolower($fileInfo['extension']) === 'sql') {
                        $query = file_get_contents($directory . '/' . $file);

                        $model = new DbMigrationModel();
                        $model->name = $fileInfo['filename'];

                        try {
                            $this->db->pdo->query($query);
                        } catch (Throwable $exception) {
                            echo "<pre>{$file}: {$query}</pre><br><br>";
                            echo $exception->getMessage();
                            wp_die();
                        }

                        $this->repository->insert($model);
                    }
                }
            }
        }
    }
}
