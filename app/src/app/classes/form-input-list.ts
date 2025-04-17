import { FormInput, FormInputTypes } from "./form-input";


export class FormInputList {
    name: string;
    label: string;
    inputs: FormInput[];
    initials?: {
        id: number;
        value: any;
    }[];

    constructor(name: string, label: string, inputs: FormInput[], initials?: { id: number; value: any }[]) {
        this.name = name;
        this.label = label;
        this.inputs = inputs;
        this.initials = initials;
    }
}