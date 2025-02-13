<?php

namespace mate\abstract\trait;

trait Singleton
{
    private static $instances = array();

    public static function inject(?array $arguments = null): self|null
    {
        $class = get_called_class();

        if (!isset(self::$instances[$class])) {
            if ($arguments !== null) {
                self::$instances[$class] = new $class(...$arguments);
            } else {
                self::$instances[$class] = new $class();
            }
        }

        return self::$instances[$class];
    }
}
