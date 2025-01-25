<?php

namespace mate\util;

class HashMap
{
    private array $map = [];

    public function set(string $key, mixed $value): void
    {
        $this->map[$key] = $value;
    }

    public function has(string $key): bool
    {
        return isset($this->map[$key]);
    }

    public function get(string $key): mixed
    {
        return $this->map[$key] ?? null;
    }

    public function remove(string $key): void
    {
        unset($this->map[$key]);
    }

    public function clear(): void
    {
        $this->map = [];
    }
}
