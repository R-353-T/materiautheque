<?php

function mate_sanitize_string(mixed $v): string|false
{
    if ($v === null || is_string($v) === false) {
        return false;
    } else {
        return trim(htmlspecialchars($v, ENT_QUOTES, 'UTF-8'));
    }
}

function mate_sanitize_int(mixed $v): int|false
{
    if ($v === null) {
        return false;
    }

    return filter_var($v, FILTER_SANITIZE_NUMBER_INT);
}
