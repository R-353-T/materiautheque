import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseForm2 } from "../class/baseform2";
import { ITemplate } from "../interface/template.interface";
import { ValueDto } from "../model/value-dto";

export class FTemplate extends BaseForm2 {
    override formGroups: { [form_name: string]: FormGroup<any> } = {
        template: new FormGroup({
            id: new FormControl<number | null>(null, [Validators.required]),
            name: new FormControl<string | null>("", [
                Validators.required,
                Validators.maxLength(255),
            ]),
            groupList: new FormArray<FormControl>([]),
        }),
    };

    override formLabels: {
        [form_name: string]: { [input_name: string]: string };
    } = {
        template: {
            name: "Nom",
            groupList: "Groupes",
        },
    };

    get formGroup() {
        return this.formGroups["template"];
    }

    get id() {
        return this.formGroup.get("id") as FormControl;
    }

    get name() {
        return this.formGroup.get("name") as FormControl;
    }

    get groupList() {
        return this.formGroup.get("groupList") as FormArray<FormControl>;
    }

    get groupDtoList() {
        return this.groupList.controls
            .map((control) => {
                const dto = new ValueDto();
                dto.id = this.groupIdList.find((val) =>
                    val.control === control
                )?.id ?? null;
                dto.value = control.value;
                return dto;
            });
    }

    private groupIdList: { id: number; control: FormControl }[] = [];

    override reset(from?: ITemplate): void {
        super.reset();
        this.groupList.clear();
        this.groupIdList = [];

        if (from) {
            this.id.setValue(from.id);
            this.name.setValue(from.name);
            from.groupList?.forEach((child) => {
                const childControl: FormControl<string | null> = new FormControl(
                    child.name
                );
                this.groupList.push(childControl);
                this.groupIdList.push({ id: child.id!, control: childControl });
            });
        }
    }

    moveGroupUp(index: number) {
        if (index > 0) {
            const value = this.groupList.at(index);
            this.groupList.removeAt(index);
            this.groupList.insert(index - 1, value);
        }
    }

    moveGroupDown(index: number) {
        if (index < this.groupList.length - 1) {
            const value = this.groupList.at(index);
            this.groupList.removeAt(index);
            this.groupList.insert(index + 1, value);
        }
    }
}

export const FORM__TEMPLATE = new FTemplate();
