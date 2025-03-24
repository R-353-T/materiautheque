import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseForm2 } from "../class/baseform2";

export class FLogin extends BaseForm2 {
    constructor() {
        super();
        this.errors["auth_forbidden"] =
            "Le nom d'utilisateur ou le mot de passe est incorrect";
    }

    override formGroups: { [form_name: string]: FormGroup<any> } = {
        login: new FormGroup({
            username: new FormControl<string | null>("", [Validators.required]),
            password: new FormControl<string | null>("", [Validators.required]),
        }),
    };

    override formLabels: {
        [form_name: string]: { [input_name: string]: string };
    } = {
        login: {
            username: "Nom d'utilisateur",
            password: "Mot de passe",
        }
    };

    get formGroup() {
        return this.formGroups["login"];
    }
    get username() {
        return this.formGroups["login"].get("username") as FormControl;
    }
    get password() {
        return this.formGroups["login"].get("password") as FormControl;
    }
}

export const FORM__LOGIN = new FLogin();
