<?php

namespace mate\middleware;

use mate\abstract\clazz\Middleware;
use WP_HTTP_Response;
use WP_REST_Server;
use WP_REST_Request;
use WP_REST_Response;

class BucketMiddleware extends Middleware
{
    private const SUFFIX = "_bucket";

    public function pre(mixed $response, WP_REST_Server $server, WP_REST_Request $request): mixed
    {
        if ($response === null && $request->get_method() !== "OPTIONS") {
            $bucket = $this->updateBucket();

            if ($bucket["count"] === 0) {
                $response = new WP_REST_Response(
                    [
                        "code" => "rate_limit_exceeded",
                        "data" => [ "status" => 429 ]
                    ],
                    429
                );
            }
        }

        return $response;
    }

    public function post(WP_HTTP_Response $response, WP_REST_Server $server, WP_REST_Request $request): WP_HTTP_Response
    {
        $bucket = $this->getBucket();

        if ($response->get_status() === 429 && $bucket["count"] === 0) {
            $response->header("Retry-After", ceil(MATE_THEME_API_BUCKET_LIMIT / MATE_THEME_API_BUCKET_TIME));
        }

        $response->header("X-RateLimit-Limit", MATE_THEME_API_BUCKET_LIMIT);
        $response->header("X-RateLimit-Remaining", $bucket["count"]);

        return $response;
    }

    private function getBucket(): array
    {
        $bucket = get_transient(self::getUserId() . BucketMiddleware::SUFFIX);

        if ($bucket === false) {
            $bucket = $this->createBucket();
        }

        return $bucket;
    }

    private function createBucket(): array
    {
        $bucket = [];
        $bucket["count"] = MATE_THEME_API_BUCKET_LIMIT;
        $bucket["lastAddDate"] = time();

        set_transient(
            self::getUserId() . BucketMiddleware::SUFFIX,
            $bucket,
            MATE_THEME_API_BUCKET_TIME
        );

        return $bucket;
    }

    private function updateBucket(): array
    {
        $bucket = $this->getBucket();
        $now = time();
        $elapsed = $bucket["lastAddDate"] - $now;
        $plus = floor(MATE_THEME_API_BUCKET_LIMIT / MATE_THEME_API_BUCKET_TIME * $elapsed);
        $bucket["count"]--;

        if ($plus > 0) {
            $bucket["count"] += $plus;
            $bucket["lastAddDate"] = $now;

            if ($bucket["count"] > MATE_THEME_API_BUCKET_LIMIT) {
                $bucket["count"] = MATE_THEME_API_BUCKET_LIMIT;
            }
        }

        if ($bucket["count"] < 0) {
            $bucket["count"] = 0;
        }

        set_transient(
            self::getUserId() . BucketMiddleware::SUFFIX,
            $bucket,
            MATE_THEME_API_BUCKET_TIME
        );

        return $bucket;
    }
}
