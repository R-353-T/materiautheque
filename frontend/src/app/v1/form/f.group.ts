import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseForm2 } from "../class/baseform2";
import { IGroup } from "../interface/group.interface";
import { ValueDto } from "../model/value-dto";

export class FGroup extends BaseForm2 {
    override formGroups: { [form_name: string]: FormGroup<any>; } = {
        group: new FormGroup({
            id: new FormControl<number|null>(null, []),
            name: new FormControl<string|null>("", [Validators.required, Validators.maxLength(255)]),
            description: new FormControl<string|null>("", [Validators.maxLength(4096)]),
            templateId: new FormControl<number|null>(null, [Validators.required]),
            parentId: new FormControl<number|null>(null, []),
            groupList: new FormArray<FormControl>([]),
            fieldList: new FormArray<FormControl>([])
        })
    };

    override formLabels: { [form_name: string]: { [input_name: string]: string; }; } = {
        group: {
            name: "Nom",
            description: "Description",
            parentId: "Parent",
            groupList: "Groupes",
            fieldList: "Champs"
        }
    };

    get formGroup() { return this.formGroups['group']; }
    get id() { return this.formGroup.get('id') as FormControl; }
    get name() { return this.formGroup.get('name') as FormControl; }
    get description() { return this.formGroup.get('description') as FormControl; }
    get templateId() { return this.formGroup.get('templateId') as FormControl; }
    get parentId() { return this.formGroup.get('parentId') as FormControl; }
    get groupList() { return this.formGroup.get('groupList') as FormArray<FormControl>; }
    get fieldList() { return this.formGroup.get('fieldList') as FormArray<FormControl>; }

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

    get fieldDtoList() {
        return this.fieldList.controls
            .map((control) => {
                const dto = new ValueDto();
                dto.id = this.fieldIdList.find((val) =>
                    val.control === control
                )?.id ?? null;
                dto.value = control.value;
                return dto;
            });
    }

    private groupIdList: { id: number, control: FormControl }[] = [];
    private fieldIdList: { id: number, control: FormControl }[] = [];

    override reset(from?: IGroup): void {
        super.reset();
        this.groupList.clear();
        this.fieldList.clear();

        this.groupIdList = [];
        this.fieldIdList = [];

        if (from) {
            this.id.setValue(from.id);
            this.name.setValue(from.name);
            this.description.setValue(from.description);
            this.templateId.setValue(from.templateId);
            this.parentId.setValue(from.parentId);

            from.groupList?.forEach((child) => {
                const childControl: FormControl<string | null> = new FormControl(
                    child.name
                );
                this.groupList.push(childControl);
                this.groupIdList.push({ id: child.id!, control: childControl });
            });

            from.fieldList?.forEach((child) => {
                const childControl: FormControl<string | null> = new FormControl(
                    child.name
                );
                this.fieldList.push(childControl);
                this.fieldIdList.push({ id: child.id!, control: childControl });
            });
        }
    }

    moveGroupUp(index: number) {
        if(index > 0) {
            const value = this.groupList.at(index);
            this.groupList.removeAt(index);
            this.groupList.insert(index - 1, value);
        }
    }

    moveGroupDown(index: number) {
        if(index < this.groupList.length - 1) {
            const value = this.groupList.at(index);
            this.groupList.removeAt(index);
            this.groupList.insert(index + 1, value);
        }
    }

    moveFieldUp(index: number) {
        if(index > 0) {
            const value = this.fieldList.at(index);
            this.fieldList.removeAt(index);
            this.fieldList.insert(index - 1, value);
        }
    }

    moveFieldDown(index: number) {
        if(index < this.fieldList.length - 1) {
            const value = this.fieldList.at(index);
            this.fieldList.removeAt(index);
            this.fieldList.insert(index + 1, value);
        }
    }
}

export const FORM__GROUP = new FGroup();