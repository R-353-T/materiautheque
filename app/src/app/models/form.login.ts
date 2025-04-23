import { Form } from "../classes/form";
import { FormInput, FormInputTypes } from "../classes/form-input";

export class LoginForm extends Form {
    constructor() {
        super(
            "Heureux de te revoir !",
            [
                new FormInput(
                    "username",
                    FormInputTypes.label,
                    "Nom d'utilisateur",
                    "",
                    undefined,
                    true
                ),
                new FormInput(
                    "password",
                    FormInputTypes.password,
                    "Mot de passe",
                    "",
                    undefined,
                    true
                ),
            ],
        );
    }

    override isValid(): boolean {
        const username = this.group.get("username");
        if(username && username.errors && Object.keys(username.errors).length === 0) {
            username.setErrors(null);
        }

        const password = this.group.get("password");
        if(password && password.errors && Object.keys(password.errors).length === 0) {
            password.setErrors(null);
        }

        return super.isValid();
    }
}
