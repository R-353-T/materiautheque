<?php

namespace mate\error;

use Exception;

class NotImplementedError extends Exception
{
    public function __construct($previous = null)
    {
        parent::__construct(
            "Not implemented",
            500,
            $previous
        );
    }
}
