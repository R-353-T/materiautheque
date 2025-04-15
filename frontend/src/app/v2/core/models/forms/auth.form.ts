import { FormControl } from "@angular/forms";
import { Form } from "../../abstracts/baseform";
import { FormInput } from "../../abstracts/input";

export class AuthForm extends Form {
    override inputs: FormInput[] = [
        new FormInput(
            'username',
            'label',
            'Nom d\'utilisateur',
            ''
        ),
        new FormInput(
            'password',
            'password',
            'Mot de passe',
            ''
        )
    ];

    constructor() {
        super('Connexion');
    }
}