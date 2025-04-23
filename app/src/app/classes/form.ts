import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { FormInput } from "./form-input";
import { signal } from "@angular/core";
import { FORM_INPUT_ERRORS } from "./form-input-error";
import { BadRequestError } from "./bad-request-error";

export class Form {
    private readonly _errors = signal<string[]>([]);

    readonly group = new FormGroup({});
    readonly errorsSignal = this._errors.asReadonly();

    get invalid() {
        return this.group.invalid && (this.group.touched || this.group.dirty) &&
            this.group.errors;
    }

    get errors() {
        if (this.group.errors) {
            return Object.keys(this.group.errors).map((key) => {
                if (key in FORM_INPUT_ERRORS) {
                    return FORM_INPUT_ERRORS[key];
                } else {

                    if(typeof this.group.errors![key] === "string") {
                        return this.group.errors![key];
                    } else {
                        return "(not implemented error) " + key;
                    }
                }
            });
        }

        return [];
    }

    constructor(public title: string, public inputs: FormInput[]) {
        this._initialize();
    }

    reset() {
        this.inputs.forEach((input) => input.reset());
    }

    getInputByName(name: string) {
        return this.inputs.find((input) => input.name === name)!;
    }

    isValid() {
        this.group.setErrors(null);
        this.group.markAllAsTouched();
        return this.group.valid;
    }

    setHttpErrors(httpErrorResponse: any) {
        if(httpErrorResponse instanceof BadRequestError) {
            this._setBadRequest(httpErrorResponse);
        } else {
            console.warn("(form) unknown http error", httpErrorResponse);
        }
    }

    private _setBadRequest(error: BadRequestError) {
        let applied = false;

        for (const errparam of error.data.parameters) {
            applied = false;

            if(errparam.name in this.group.controls) {
                if(errparam.index !== undefined) {
                    const fArray = this.group.get(errparam.name) as FormArray<FormControl>;
                    fArray.at(errparam.index)?.setErrors({ [errparam.code]: errparam.data ?? true });
                } else {
                    this.group.get(errparam.name)?.setErrors({ [errparam.code]: errparam.data ?? true });
                }

                applied = true;
            }

            // for(const form_name in this.group) {
            //     if(this.formGroups[form_name].get(errparam.name)) {
            //         if(errparam.index !== undefined) {
            //             const fArray = this.formGroups[form_name].get(errparam.name) as FormArray<FormControl>;
            //             fArray.at(errparam.index)?.setErrors({ [errparam.code]: errparam.data ?? true });
            //         } else {
            //             this.formGroups[form_name].get(errparam.name)?.setErrors({ [errparam.code]: true });
            //             applied = true;
            //         }
            //     }
            // }

            if(!applied) {
                console.warn("--- Error not applied ---", errparam);
            }
        }
        
    }

    private _initialize() {
        this.inputs.forEach((input) => {
            this.group.addControl(input.name, input.control);
        });
    }
}
