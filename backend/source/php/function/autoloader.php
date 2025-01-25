<?php

function mate_autoloader(string $namespace, string $directory)
{
    return function (string $class) use ($namespace, $directory) {
        if (strpos($class, $namespace) === 0) {
            $relative_class = substr($class, strlen($namespace));
            $relative_path = str_replace("\\", DIRECTORY_SEPARATOR, $relative_class);
            $relative_path = str_replace("-", "", $relative_path);
            $file_path = $directory . $relative_path . ".php";
            if (file_exists($file_path)) {
                require $file_path;
                return;
            }
        }
    };
}
