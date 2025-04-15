import { FormControl, Validators } from "@angular/forms";
import { InputType, InputTypes } from "../enums/InputTypes";
import { DecimalValidator } from "src/app/v1/validator/decimal.validator";
import { NumericValidator } from "src/app/v1/validator/numeric.validator";
import { signal, Signal } from "@angular/core";


export class FormInput {
    static inputValidators (type:InputType, required: boolean = false) {
        const output = [];

        if(required) {
            output.push(Validators.required);
        }

        switch (InputTypes[type]) {
            case InputTypes.label:
                output.push(Validators.maxLength(255));
                break;

            case InputTypes.text:
                output.push(Validators.maxLength(65535));
                break;

            case InputTypes.url:
                output.push(Validators.maxLength(4096));
                break;

            case InputTypes.number:
                output.push(
                    Validators.min(-2147483648),
                    Validators.max(2147483647),
                    DecimalValidator()
                );
                break;

            case InputTypes.money:
                output.push(NumericValidator());
                break;
        }

        return output;
    }

    name: string;
    label?: string;
    type: InputType;
    control: FormControl;

    initial?: any;
    id?: number;

    errorsSignal: Signal<string[]>;
    hintsSignal: Signal<string[]>;

    private readonly _errors = signal<string[]>([]);
    private readonly _hints = signal<string[]>([]);

    constructor(
        name: string,
        type: InputType,
        label?: string,
        initial?: any,
        id?: number,
    ) {
        this.name = name;
        this.type = type;
        this.control = new FormControl(initial, FormInput.inputValidators(type));
        this.label = label;
        this.initial = initial;
        this.id = id;
        this.errorsSignal = this._errors.asReadonly();
        this.hintsSignal = this._hints.asReadonly();
    }

    reset() {
        this.control.reset(this.initial);
    }
}

export class EnumeratorValueInput extends FormInput {
    enumeratorId: number;

    constructor(
        enumeratorId: number,
        name: string,
        type: InputType,
        label?: string,
        initial?: any,
        id?: number,
    ) {
        super(name, type, label, initial, id);
        this.enumeratorId = enumeratorId;
    }
}

export class UnitValueInput extends FormInput {
    unitId: number;

    constructor(
        unitId: number,
        name: string,
        type: InputType,
        label?: string,
        initial?: any,
        id?: number,
    ) {
        super(name, type, label, initial, id);
        this.unitId = unitId;
    }
}

export class InputList {
    name: string;
    label: string;
    type: InputType;
    inputs: FormInput[];
    initials?: {
        id: number;
        value: any;
    }[];

    constructor(name: string, label: string, type: InputType, inputs: FormInput[], initials?: { id: number; value: any }[]) {
        this.name = name;
        this.label = label;
        this.type = type;
        this.inputs = inputs;
        this.initials = initials;
    }
}
