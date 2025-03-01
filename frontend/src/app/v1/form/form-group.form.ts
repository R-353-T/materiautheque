import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { BaseForm } from "../class/baseform";
import { IField } from "../interface/field.interface";

export class FormGroupForm extends BaseForm<any> {
    constructor(originalFields: IField[]) {
        super();

        this.originalFields = originalFields.map((field) => {
            const cf = {
                field: field,
                control: new FormControl(),
            };

            this.fields.push(cf.control);
            return cf;
        });
    }

    originalFields: {
        field: IField;
        control: FormControl | FormArray<FormControl>;
    }[] = [];

    override formGroup = new FormGroup({
        fields: new FormArray<FormControl | FormArray>([]),
    });

    get fields() {
        return this.formGroup.get("fields") as FormArray<
            FormControl | FormArray<FormControl>
        >;
    }
}
