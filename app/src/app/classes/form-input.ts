import { FormControl, Validators } from "@angular/forms";
import { AdvancedValidators } from "./advenced-validators";
import { FORM_INPUT_ERRORS } from "./form-input-error";

export enum FormInputTypes {
    'label' = 1,
    'text' = 2,
    'url' = 3,
    'number' = 4,
    'money' = 5,
    'date' = 6,
    'boolean' = 7,
    'image' = 8,
    'password' = 9,
    'enumerator' = 10,
    'unit' = 11,
    'type' = 12,
    'group' = 13,
    'form' = 14,
    'enumerator_value' = 15,
    'unit_value' = 16
}

export class FormInput {
    static inputValidators (type: FormInputTypes, required: boolean = false) {
        const output = [];

        if(required) {
            output.push(Validators.required);
        }

        switch (type) {
            case FormInputTypes.label:
                output.push(Validators.maxLength(255));
                break;

            case FormInputTypes.text:
                output.push(Validators.maxLength(65535));
                break;

            case FormInputTypes.url:
                output.push(Validators.maxLength(4096));
                break;

            case FormInputTypes.number:
                output.push(
                    Validators.min(-2147483648),
                    Validators.max(2147483647),
                    AdvancedValidators.decimal()
                );
                break;

            case FormInputTypes.money:
                output.push(AdvancedValidators.numeric());
                break;
        }

        return output;
    }

    label?: string;
    initial?: any;
    id?: number;

    readonly control: FormControl;

    constructor(
        public name: string,
        public type: FormInputTypes,
        label?: string,
        initial?: any,
        id?: number,
    ) {
        this.name = name;
        this.type = type;
        this.label = label;
        this.initial = initial;
        this.id = id;
        this.control = new FormControl(this.initial, FormInput.inputValidators(type));
    }

    reset() {
        this.control.reset(this.initial);
    }

    get invalid() {
        return this.control.invalid && (this.control.touched || this.control.dirty);
    }

    get errors() {
        if(this.control.errors) {
            return Object.keys(this.control.errors).map((key) => {
                if(key in FORM_INPUT_ERRORS) {
                    return FORM_INPUT_ERRORS[key];
                } else {
                    return "error: " + key;
                }
            });
        }

        return [];
    }
}

export class EnumeratorValueInput extends FormInput {
    enumeratorId: number;

    constructor(
        enumeratorId: number,
        name: string,
        label?: string,
        initial?: any,
        id?: number,
    ) {
        super(name, FormInputTypes.enumerator_value, label, initial, id);
        this.enumeratorId = enumeratorId;
    }
}

export class UnitValueInput extends FormInput {
    unitId: number;

    constructor(
        unitId: number,
        name: string,
        label?: string,
        initial?: any,
        id?: number,
    ) {
        super(name, FormInputTypes.unit_value, label, initial, id);
        this.unitId = unitId;
    }
}
