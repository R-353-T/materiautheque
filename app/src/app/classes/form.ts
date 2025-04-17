import { FormGroup } from "@angular/forms";
import { FormInput } from "./form-input";
import { signal } from "@angular/core";
import { FORM_INPUT_ERRORS } from "./form-input-error";

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
        this.initialize();
    }

    reset() {
        this.inputs.forEach((input) => input.reset());
    }

    isValid() {
        this.group.setErrors(null);
        this.group.markAllAsTouched();
        return this.group.valid;
    }

    private initialize() {
        this.inputs.forEach((input) => {
            this.group.addControl(input.name, input.control);
        });
    }
}
