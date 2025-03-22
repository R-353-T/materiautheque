import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseForm2 } from "../class/baseform2";
import { IUnit } from "../interface/unit.interface";
import { ValueDto } from "../model/value-dto";
import { ValidatorService } from "../service/validator.service";
import { TypeEnum } from "../enum/Type";

export class FUnit extends BaseForm2 {
    override formGroups: { [form_name: string]: FormGroup<any> } = {
        unit: new FormGroup({
            id: new FormControl<number | null>(null, []),
            name: new FormControl<string | null>("", [
                Validators.required,
                Validators.maxLength(255),
            ]),
            description: new FormControl<string | null>("", [
                Validators.maxLength(4096),
            ]),
            valueList: new FormArray<FormControl>([]),
        }),
    };

    override formLabels: {
        [form_name: string]: { [input_name: string]: string };
    } = {
        unit: {
            name: "Nom",
            description: "Description",
            valueList: "Valeurs",
        },
    };

    get formGroup() {
        return this.formGroups["unit"];
    }

    get id() {
        return this.formGroups["unit"].get("id") as FormControl;
    }

    get name() {
        return this.formGroups["unit"].get("name") as FormControl;
    }

    get description() {
        return this.formGroups["unit"].get("description") as FormControl;
    }

    get valueList() {
        return this.formGroups["unit"].get("valueList") as FormArray<
            FormControl
        >;
    }
    
    get valueDtoList() {
        return this.valueList.controls.map(
            (control) => {
                const dto = new ValueDto();
                dto.id =
                    this.controlIdList.find((val) => val.control === control)
                        ?.id ?? null;
                dto.value = control.value;
                return dto;
            },
        );
    }

    private controlIdList: { id: number; control: FormControl }[] = [];

    override reset(from?: IUnit): void {
        super.reset();
        this.valueList.clear();
        this.controlIdList = [];

        if (from) {
            this.id.setValue(from.id);
            this.name.setValue(from.name);
            this.description.setValue(from.description);

            from.valueList.forEach((value) => {
                this.controlIdList.push({
                    id: value.id!,
                    control: this.addValue(value.value),
                });
            });
        }
    }

    addValue(initial: string = "") {
        const control = new FormControl(initial, [
            Validators.required,
            ...ValidatorService.validatorByTypeId(TypeEnum.LABEL),
        ]);
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

export const FORM__UNIT = new FUnit();
