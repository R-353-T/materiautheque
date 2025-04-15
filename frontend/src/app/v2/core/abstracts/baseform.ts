import { FormGroup } from "@angular/forms";
import { FormInput } from "./input";
import { Signal, signal } from "@angular/core";


export class FormList {
    forms?: Form[];
}

export class Form {
    formGroup = new FormGroup({});
    inputs: FormInput[] = [];
    errorsSignal: Signal<string[]>;

    readonly title: string;
    private readonly _errors = signal<string[]>([]);

    constructor(title: string) {
        this.title = title;
        this.inputs.forEach((input) => {
            this.formGroup.addControl(input.name, input.control);
        });
        this.errorsSignal = this._errors.asReadonly();
    }
}