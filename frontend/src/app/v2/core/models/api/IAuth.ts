import { UserRole } from "../../enums/UserRoles";


export interface IAuthentication {
    user_display_name: string;
    user_email: string;
    user_nicename: string;
    user_role: string;
    token: string;
}

export interface IAuthenticationValidated {
    code: "jwt_auth_valid_token";
};

export interface IAuthenticationParsed {
    displayName: string;
    email: string;
    name: string;
    role: UserRole;
    token: string;
}