import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseForm } from "../class/baseform";
import { IUnit } from "../interface/unit.interface";
import { ValueDto } from "../model/value-dto";

export class UnitForm extends BaseForm<IUnit> {

    constructor() {
        super();
        this.errors["duplicate"] = "Ce nom est déjà utilisé";
    }

    private originValueControlList: { id: number, control: FormControl<string> }[] = [];

    override formGroup = new FormGroup({
        id: new FormControl<number>(-1, [Validators.required]),
        name: new FormControl<string>("", [Validators.required, Validators.maxLength(255)]),
        description: new FormControl<string>("", [Validators.maxLength(4096)]),
        valueList: new FormArray<FormControl>([])
    });

    override labelGroup = {
        name: "Nom :",
        description: "Description :",
        valueList: "Valeurs :"
    };

    get id() { return this.formGroup.get('id') as FormControl<number>; }
    get name() { return this.formGroup.get('name') as FormControl<string>; }
    get description() { return this.formGroup.get('description') as FormControl<string>; }
    get valueList() { return this.formGroup.get('valueList') as FormArray<FormControl>; }

    get parsedValueList() {
        return this.valueList.controls.map(
            control => {
                const id = this.originValueControlList.find((val) => val.control === control)?.id ?? null;
                const dto = new ValueDto();
                dto.id = id;
                dto.value = control.value;
                return dto;
            }
        );
    }

    private get valueValidators() {
        return [
            Validators.required,
            Validators.maxLength(255)
        ];
    }

    override reset(): void {
        super.reset();
        this.id.setValue(-1);
        this.valueList.clear();

        if (this.origin) {
            this.id.setValue(this.origin.id);
            this.name.setValue(this.origin.name);
            this.description.setValue(this.origin.description);

            this.originValueControlList = [];

            this.origin.valueList.forEach((value) => {
                const control = new FormControl(value.value, this.valueValidators);
                this.valueList.push(control);
                this.originValueControlList.push({ id: value.id!, control });
            });
        }
    }

    addValue = () => this.valueList.push(new FormControl("", this.valueValidators));
    removeValueAt = (index: number) => this.valueList.removeAt(index);
    moveValueUp(index: number) {
        if (index > 0) {
            const value = this.valueList.at(index);
            this.valueList.removeAt(index);
            this.valueList.insert(index - 1, value);
        }
    }

    moveValueDown(index: number) {
        if (index < this.valueList.length - 1) {
            const value = this.valueList.at(index);
            this.valueList.removeAt(index);
            this.valueList.insert(index + 1, value);
        }
    }
}

export const UNIT_CREATE_FORM = new UnitForm();
export const UNIT_UPDATE_FORM = new UnitForm();