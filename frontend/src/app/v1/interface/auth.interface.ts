
export interface IAuthLoginResponse {
    code: "jwt_auth_valid_token";
};

export interface IAuthLoginError {
    code: "auth_forbidden";
};

export interface IAuthValidTokenResponse {
    code: "jwt_auth_valid_token";
};

export interface IAuthValidTokenError {
    code: "jwt_auth_invalid_token";
};

export interface IAuthUser
{
    user_display_name: string;
    user_email: string;
    user_nicename: string;
    user_role: string;
    token: string;
};