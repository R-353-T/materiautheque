import { AbstractControl, FormGroup } from "@angular/forms";
import { BadRequestError } from "../error/BadRequestError";
import { TooManyRequestError } from "../error/TooManyRequestError";

export class BaseForm2 {
    errors: { [code:string]: string } = {
        "fobidden": "Action interdite",
        "auth_forbidden": "Action refusée",
        "internal_server_error": "Ooops.. une erreur inattendue est survenue",
        "too_many_tries": "Vous avez atteint le nombre maximum de tentatives, veuillez attendre quelques minutes",

        "incorrect": "La valeur est incorrecte un.e $1 attendu.e",
        "not_found": "La référence est introuvable",
        "not_related": "La référence est introuvable ou non relative",
        "required": "Une valeur est requise",
        "unavailable": "La valeur est déjà utilisée",

        "number_min": "La valeur doit à dépassée la limite inférieur de $1",
        "number_max": "La valeur doit à dépassée la limite supérieur de $1",

        "string_max": "La valeur est trop longue et doit contenir maximum $1 caractères",

        "type_not_enum": "Ce type n'est pas énumérable",
        "type_not_multiple": "Ce type ne peut pas contenir plusieurs valeurs",
        "type_not_unit": "Ce type n'est pas unitaire",

        "file_not_supported": "Ce type de fichier n'est pas supporté",
        "file_too_large": "Le fichier est trop volumineux",

        "circular_reference": "La valeur provoque une reference circulaire",
        "template_missmatch": "Le template n'est pas correspondant"
    }

    types: { [code:string]: string } = {
        "INTEGER": "nombre entier",
        "NUMERIC": "nombre",
        "STRING": "chaine de caractères",
        "BOOLEAN": "booléen",
        "DATE": "date",
        "ARRAY": "tableau",
        "URL": "URL",
        "FILE": "fichier"
    }

    formGroups!: { [form_name: string]: FormGroup };
    formLabels!: { [form_name: string]: { [input_name: string]: string } };
    locked = false;

    lock() {
        if (this.locked) {
            return false;
        }

        this.locked = true;
        return true;
    }

    unlock() {
        this.locked = false;
    }

    isOk() {
        let isOk = true;

        for (const form_name in this.formGroups) {
            this.formGroups[form_name].markAllAsTouched();

            if (this.formGroups[form_name].invalid) {
                isOk = false;
            }
        }

        if(isOk === false) {
            this.debug();
        }

        return isOk;
    }

    reset() {
        this.unlock();

        for (const form_name in this.formGroups) {
            this.formGroups[form_name].reset();
        }
    }


    public getErrors(control: AbstractControl) {
        let errors = [];

        if (control.invalid && (control.dirty || control.touched)) {
            for (const key in control.errors) {
                if (control.errors[key] === true) {
                    errors.push(this.errors[key]);
                }
            }
        }

        return errors;
    }

    public httpError(error: any) {
        if (error instanceof BadRequestError) {
          this.badRequest(error);
        } else if (error instanceof TooManyRequestError) {
            for(const form_name in this.formGroups) {
                this.formGroups[form_name].setErrors({ too_many_tries: true });
            }
        } else if (error.status && error.status === 403) {
            for(const form_name in this.formGroups) {
                this.formGroups[form_name].setErrors({ auth_forbidden: true });
            }
        } else if(error.status && error.status === 500) {
            for(const form_name in this.formGroups) {
                this.internalError(form_name, error);
            }
        } else {
            console.warn("[BASEFORM] Not implemented error", error);
        }
    }

    public badRequest(error: BadRequestError) {
        let applied = false;

        for (const errparam of error.data.parameters) {
            applied = false;

            for(const form_name in this.formGroups) {
                if(this.formGroups[form_name].get(errparam.name)) {
                    this.formGroups[form_name].get(errparam.name)?.setErrors({ [errparam.code]: true });
                    applied = true;
                }
            }

            if(!applied) {
                console.warn("--- Error not applied ---", errparam);
            }
        }
    }

    public internalError(formName: string, error: any) {
        this.formGroups[formName].setErrors({ internal_server_error: true });

        if(error.error && error.error.message) {
            this.errors['internal_server_error'] = `[INTERNAL] ${error.error.message}`;
        }
    }

    public debug() {
        for (const form_name in this.formGroups) {
            console.log(form_name, this.formGroups[form_name].value);
        }
    }
}
