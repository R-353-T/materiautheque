export type Role = "guest" | "subscriber" | "contributor" | "author" | "editor" | "administrator";

export enum Roles {
    'guest' = 1,
    'subscriber' = 2,
    'contributor' = 3,
    'author' = 4,
    'editor' = 5,
    'administrator' = 6
};

export interface IUserResponse {
    user_display_name: string;
    user_email: string;
    user_nicename: string;
    user_role: Role;
    token: string;
}

export interface IUser {
    displayName: string;
    email: string;
    name: string;
    role: Roles;
    token: string;
}

export interface IAuthentication {
    username: string;
    password: string;
}

export interface IAuthenticationValidateResponse {
    code: "jwt_auth_valid_token";
};