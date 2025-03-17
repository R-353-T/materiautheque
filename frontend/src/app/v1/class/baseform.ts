import { AbstractControl, FormArray, FormControl, FormGroup } from "@angular/forms";
import { IBadRequestParam } from "../interface/api.interface";

export abstract class BaseForm<T> {

    public origin?: T;
    public formGroup!: FormGroup;
    public labelGroup: any = {};

    public readonly errors: { [key: string]: string } = {
        maxlength: 'La valeur du champ est trop longue',
        invalidType: 'Le type de la valeur du champ est incorrect',
        invalidUrl: 'Ceci n\'est pas une URL valide (http, https ou ftp)',
        invalidBoolean: 'Le type de la valeur est incorrect',
        invalidNumber: 'La valeur du champ doit être un nombre réel',
        invalidDecimalFormat: 'La valeur du champ ne peut contenir que six décimales et quinze chiffres maximum',
        invalidDateFormat: 'Le format de la date est incorrect',
        emptyString: 'La valeur du champ est obligatoire (autre que des espaces)',
        max: 'La valeur du champ est trop grande',
        min: 'La valeur du champ est trop petite',
        
        // API

        duplicate: "La valeur est dupliquée",
        empty: "La valeur ne doit pas être vide ou null",
        not_implemented: "Une erreur interne est survenu",
        required: 'La valeur du champ est obligatoire',
        too_long: "La valeur est trop longue",

        incorrect_type: "La valeur est incorrecte (&1 attendu)",
        not_foreign_of: "La valeur n'appartient pas à &1",
    };

    errorOf(c: AbstractControl): boolean|string {
        let result: boolean|string = false;

        if(c.errors !== null && (c.dirty || c.touched) && c.invalid) {

            for(const key in c.errors) {
                result = c.errors[key];

                if(result === true || typeof result === "object" ) {
                    result = this.errors[key];
                }
            }
        }

        return result;
    }

    applyBadRequestErrors(errors: IBadRequestParam[]) {
        // for(const error of errors) {
        //     if(error.name && this.formGroup.get(error.name)) {
        //         const control = this.formGroup.get(error.name)!;

        //         if(error.code in this.errors) {
        //             control.setErrors({ [error.code]: true });

        //             if(error.code === "incorrect_type") {
        //                 control.setErrors({ [error.code]: this.errors[error.code].replace("&1", error.type!) });
        //             }

        //             if(error.code === "not_foreign_of") {
        //                 control.setErrors({ [error.code]: this.errors[error.code].replace("&1", error.foreign!) });
        //             }
        //         } else {
        //             control.setErrors({ [error.code]: true });
        //         }
        //     } else {
        //         if(error.code in this.errors) {
        //             this.formGroup.setErrors({ [error.code]: this.errors[error.code] });
        //         } else {
        //             this.formGroup.setErrors({ [error.code]: true });
        //         }
        //     }
        // }
    }

    valid() {
        this.formGroup.markAllAsTouched();
        this.formGroup.setErrors(null);

        if(this.formGroup.invalid) {
            this.debugControls();
        }

        return this.formGroup.valid;
    }

    reset() {
        if(this.formGroup.disabled) {
            this.formGroup.enable();
        }
        
        this.formGroup.reset();
    }

    debugControls() {
        for(const key in this.formGroup.controls) {

            if(this.formGroup.controls[key] instanceof FormControl) {
                if(this.formGroup.controls[key].invalid) {
                    console.warn(key, this.formGroup.controls[key].errors);
                }
            } else if(this.formGroup.controls[key] instanceof FormArray) {
                for(const subKey in this.formGroup.controls[key].controls) {
                    if(this.formGroup.controls[key].controls[subKey].invalid) {
                        console.warn(key, subKey, this.formGroup.controls[key].controls[subKey].errors);
                    }
                }
            }
        }
    }

}