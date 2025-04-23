import { Form } from "../classes/form";
import { FormInput, FormInputTypes } from "../classes/form-input";

export class CreateImageForm extends Form {
    constructor() {
        super(
            "Ajouter une nouvelle image",  
            [
                new FormInput(
                    "name",
                    FormInputTypes.label,
                    "Nom de l'image",
                    "",
                    undefined,
                    true
                ),
                new FormInput(
                    "file",
                    FormInputTypes.image,
                    "Image",
                    null,
                    undefined,
                    true
                ),
            ]
        );
    }
}