<?php

namespace mate\middleware;

use mate\abstract\clazz\Middleware;
use WP_HTTP_Response;
use WP_REST_Server;
use WP_REST_Request;
use WP_REST_Response;

class AuthMiddleware extends Middleware
{
    private const SUFFIX = "auth";

    public function pre(mixed $response, WP_REST_Server $server, WP_REST_Request $request): mixed
    {
        if ($response === null && $request->get_route() === MATE_THEME_AUTH_ENDPOINT) {
            $userInfo = $this->updateUserInfo();

            if ($userInfo["jailed"]) {
                $response = new WP_REST_Response(
                    [
                        "data" => [
                            "status" => 403,
                            "jailed" => true
                        ]
                    ],
                    403
                );
            }
        }

        return $response;
    }

    public function post(WP_HTTP_Response $response, WP_REST_Server $server, WP_REST_Request $request): WP_HTTP_Response
    {
        if ($request->get_route() === MATE_THEME_AUTH_ENDPOINT) {
            $rdata = $response->get_data();
            $userInfo = $this->getUserInfo();

            switch ($response->get_status()) {
                case 200:
                    $user = get_user_by("email", $rdata["user_email"]);
                    $rdata["user_role"] = $user->roles[0];
                    delete_transient(self::getUserId() . AuthMiddleware::SUFFIX);
                    break;

                case 403:
                    if ($rdata["data"]["jailed"] === true) {
                        $response->header("Retry-After", MATE_THEME_API_LOGIN_JAIL_TIME);
                    }

                    $response->header("X-RateLimit-Limit", MATE_THEME_API_MAX_LOGIN_ATTEMPS);

                    $remainingAttemps = MATE_THEME_API_MAX_LOGIN_ATTEMPS - $userInfo["connectionAttemps"];
                    $response->header("X-RateLimit-Remaining", $remainingAttemps);

                    $rdata["code"] = "auth_forbidden";
                    unset($rdata["message"]);
                    unset($rdata["status"]);
                    break;
            }

            $response->set_data($rdata);
        }

        return $response;
    }

    private function getUserInfo(): array
    {
        $userInfo = get_transient(self::getUserId() . AuthMiddleware::SUFFIX);

        if ($userInfo === false) {
            return $this->createUserInfo();
        }

        return $userInfo;
    }

    private function createUserInfo(): array
    {
        $userInfo = [];
        $userInfo["connectionAttemps"] = 0;
        $userInfo["jailed"] = false;

        set_transient(
            self::getUserId() . AuthMiddleware::SUFFIX,
            $userInfo,
            MATE_THEME_API_LOGIN_JAIL_TIME
        );

        return $userInfo;
    }

    private function updateUserInfo(): array
    {
        $userInfo = $this->getUserInfo();
        $userInfo["connectionAttemps"]++;
        $userInfo["jailed"] = $userInfo["connectionAttemps"] > MATE_THEME_API_MAX_LOGIN_ATTEMPS;

        if ($userInfo["jailed"]) {
            $userInfo["connectionAttemps"] = MATE_THEME_API_MAX_LOGIN_ATTEMPS;
        }

        set_transient(
            self::getUserId() . AuthMiddleware::SUFFIX,
            $userInfo,
            MATE_THEME_API_LOGIN_JAIL_TIME
        );

        return $userInfo;
    }
}
