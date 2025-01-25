<?php

namespace mate\util;

use mate\error\WPErrorBuilder;

class RestPermission
{
    public const EVERYONE       = "__return_true";
    public const SUBSCRIBER     = [self::class, "isSubscriber"];
    public const CONTRIBUTOR    = [self::class, "isContributor"];
    public const AUTHOR         = [self::class, "isAuthor"];
    public const EDITOR         = [self::class, "isEditor"];
    public const ADMIN          = [self::class, "isAdmin"];

    public static function isSubscriber()
    {
        return is_user_logged_in() && current_user_can("read")
            ? true
            : WPErrorBuilder::forbiddenError();
    }

    public static function isContributor()
    {
        return is_user_logged_in() && current_user_can("edit_posts")
            ? true
            : WPErrorBuilder::forbiddenError();
    }

    public static function isAuthor()
    {
        return is_user_logged_in() && current_user_can("delete_published_posts")
            ? true
            : WPErrorBuilder::forbiddenError();
    }

    public static function isEditor()
    {
        return is_user_logged_in() && current_user_can("edit_others_posts")
            ? true
            : WPErrorBuilder::forbiddenError();
    }

    public static function isAdmin()
    {
        return is_user_logged_in() && current_user_can("manage_options")
            ? true
            : WPErrorBuilder::forbiddenError();
    }
}
