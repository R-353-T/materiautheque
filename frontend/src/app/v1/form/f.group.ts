import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseForm2 } from "../class/baseform2";
import { IGroup } from "../interface/group.interface";

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
            parentId: "Groupe parent",
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

    private groupIdList: { id: number, control: FormControl }[] = [];
    private fieldIdList: { id: number, control: FormControl }[] = [];

    override reset(from?: IGroup): void {
        super.reset();
        this.groupIdList = [];
        this.fieldIdList = [];
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