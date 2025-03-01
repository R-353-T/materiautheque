import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseForm } from "../class/baseform";
import { IAuthUser } from "../interface/auth.interface";

export class AuthLoginForm extends BaseForm<IAuthUser> {

    public constructor() {
        super();
        this.errors["auth_forbidden"] = "Le nom d'utilisateur ou le mot de passe incorrect";
    }

    override formGroup = new FormGroup({
        username: new FormControl<string>("", [Validators.required]),
        password: new FormControl<string>("", [Validators.required]),
    });

    override labelGroup = {
        username: "Nom d'utilisateur :",
        password: "Mot de passe :"
    };

    get username() { return this.formGroup.get('username') as FormControl<string>; }
    get password() { return this.formGroup.get('password') as FormControl<string>; }
    
}

export const AUTH_LOGIN_FORM = new AuthLoginForm();