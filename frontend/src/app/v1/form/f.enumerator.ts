import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseForm2 } from "../class/baseform2";
import { IEnumerator } from "../interface/enumerator.interface";
import { ValueDto } from "../model/value-dto";

export class FEnumerator extends BaseForm2
{
    override formGroups = {
        enumerator: new FormGroup({
            id: new FormControl<number|null>(null, [Validators.required]),
            name: new FormControl<string|null>("", [Validators.required, Validators.maxLength(255)]),
            description: new FormControl<string|null>("", [Validators.maxLength(4096)]),
            typeId: new FormControl<number>(1, [Validators.required]),
            valueList: new FormArray<FormControl>([])
        })
    };

    override formLabels = {
        enumerator: {
            name: "Nom",
            description: "Description",
            typeId: "Type",
            valueList: "Valeurs"
        }
    };

    get formGroup() { return this.formGroups['enumerator']; }
    get id() { return this.formGroups['enumerator'].get('id') as FormControl; }
    get name() { return this.formGroups['enumerator'].get('name') as FormControl; }
    get description() { return this.formGroups['enumerator'].get('description') as FormControl; }
    get typeId() { return this.formGroups['enumerator'].get('typeId') as FormControl; }
    get valueList() { return this.formGroups['enumerator'].get('valueList') as FormArray<FormControl>; }
    get valueDtoList() {
        return this.valueList.controls.map(
            control => {
                const dto = new ValueDto();
                dto.id = this.controlIdList.find((val) => val.control === control)?.id ?? null;
                dto.value = control.value;
                return dto;
            }
        );
    }

    private controlIdList: { id: number, control: FormControl }[] = [];

    override reset(from?: IEnumerator): void {
        super.reset();
        this.valueList.clear();
        this.controlIdList = [];

        if(from) {
            this.id.setValue(from.id);
            this.name.setValue(from.name);
            this.description.setValue(from.description);

            from.valueList.forEach((value) => {
                this.controlIdList.push({
                    id: value.id!,
                    control: this.addValue(value.value)
                });
            });
        }
    }

    addValue(initial: string = "") {
        const control = new FormControl(initial, [Validators.required]);
        this.valueList.push(control);
        return control;
    }

    removeValueAt(index: number) {
        this.valueList.removeAt(index);
    }

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

export const FORM__ENUMERATOR = new FEnumerator();