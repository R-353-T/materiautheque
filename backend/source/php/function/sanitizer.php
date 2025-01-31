<?php

function mate_sanitize_string(mixed $v): string|false
{
    if ($v === null || is_string($v) === false) {
        return false;
    }

    return trim(htmlspecialchars($v, ENT_QUOTES, 'UTF-8'));
}

function mate_sanitize_int(mixed $v): int|false
{
    if ($v === null) {
        return false;
    }

    $v = filter_var($v, FILTER_SANITIZE_NUMBER_INT);
    $v = filter_var($v, FILTER_VALIDATE_INT);
    return $v !== false ? $v : false;
}

function mate_sanitize_array(mixed $v): array|false
{
    if ($v === null || is_array($v) === false) {
        return false;
    }

    return $v;
}

function mate_sanitize_url(mixed $v): string | false
{
    if ($v === null || is_string($v) === false) {
        return false;
    }

    $v = filter_var($v, FILTER_SANITIZE_URL);
    return filter_var($v, FILTER_VALIDATE_URL) !== false ? $v : false;
}

function mate_sanitize_float(mixed $v): int|float|false
{
    if ($v === null) {
        return false;
    }

    $v = filter_var($v, FILTER_SANITIZE_NUMBER_FLOAT);
    $v = filter_var($v, FILTER_VALIDATE_FLOAT);
    return $v !== false ? $v : false;
}
