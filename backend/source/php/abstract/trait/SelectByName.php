<?php

namespace mate\abstract\trait;

use PDO;

trait SelectByName
{
    public function selectByName(string $name): ?object
    {
        $s = $this->db->prepare("SELECT * FROM {$this->table} WHERE `name` = :name");
        $s->bindValue(":name", $name, PDO::PARAM_STR);
        $s->execute();
        $s->setFetchMode(PDO::FETCH_CLASS, $this->model);
        $m = $s->fetch();

        if ($m !== false) {
            $this->cache->set($m->id, $m);
            return $m;
        } else {
            return null;
        }
    }
}
