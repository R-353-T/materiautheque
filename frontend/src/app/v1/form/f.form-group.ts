import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseForm2 } from "../class/baseform2";
import { IGroup } from "../interface/group.interface";
import { ValueDto } from "../model/value-dto";
import { IField } from "../interface/field.interface";
import { ValidatorService } from "../service/validator.service";
import { signal } from "@angular/core";
import { BaseFormField } from "../interface/app.interface";

export class FFormGroup extends BaseForm2 {
    public static loadGroup(group: IGroup, depth: number = 0) {
        const groups = [];
        groups.push(new FFormGroup(group, depth));

        group.groupList?.forEach((child) => {
            groups.push(...FFormGroup.loadGroup(child, depth + 1));
        });

        return groups;
    }

    override formGroups: { [form_name: string]: FormGroup<any>; } = {};

    fields = signal<BaseFormField[]>([]);
    group: IGroup;
    depth: number;

    get formGroup() {
        return this.formGroups["group"];
    }

    constructor(group: IGroup, depth: number = 0) {
        super();
        this.group = group;
        this.depth = depth;
        this.initialize();
    }

    loadValues(dto: ValueDto | ValueDto[]) {
    }

    private initialize() {
        this.formGroups["group"] = new FormGroup({});
        this.buildFields();
    }

    private buildFields() {
        if (this.group.fieldList && this.group.fieldList.length > 0) {
            this.group.fieldList.forEach((field) => {
                if (field.allowMultipleValues) {
                    this.buildMultipleField(field);
                } else {
                    this.buildSingleField(field);
                }
            });
        }
    }

    private buildSingleField(field: IField) {
        let validators = ValidatorService.validatorByTypeId(field.typeId);

        if (field.isRequired) {
            validators.push(Validators.required);
        }

        const control = new FormControl<any>(null, validators);
        const unit = new FormControl<number|null>(null, [Validators.required]);

        this.formGroup.addControl(field.name, control);

        if (field.unitId) {
            this.formGroup.addControl(field.name + "_unit", unit);
        }

        this.fields.update((fields) => {
            fields.push({
                field,
                controls: {
                    value: control,
                    unit: field.unitId ? unit : undefined,
                },
            });

            return fields;
        });
    }

    private buildMultipleField(field: IField) {
        let validators = ValidatorService.validatorByTypeId(field.typeId);

        if (field.isRequired) {
            validators.push(Validators.required);
        }

        const values = new FormArray<FormControl>([]);
        const units = new FormArray<FormControl>([]);

        this.formGroup.addControl(field.name, values);

        if (field.unitId) {
            this.formGroup.addControl(field.name + "_units", units);
        }

        this.fields.update((fields) => {
            fields.push({
                field,
                controls: {
                    value:values,
                    unit: field.unitId ? units : undefined,
                },
            });

            return fields;
        });
    }
}
