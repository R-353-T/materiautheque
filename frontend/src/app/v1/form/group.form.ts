import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseForm } from "../class/baseform";
import { IGroup } from "../interface/group.interface";

export class GroupForm extends BaseForm<IGroup> {

    constructor() {
        super();
        this.errors["template_group_missmatch"] = "Ce groupe ne correspond pas au template";
    }

    originGroupControlList: { id:number, control: FormControl<string|null> }[] = [];
    originFieldControlList: { id:number, control: FormControl<string|null> }[] = [];

    override formGroup = new FormGroup({
        id: new FormControl<number|null>(null, [Validators.required]),
        name: new FormControl<string>("", [
            Validators.required,
            Validators.maxLength(255)
        ]),
        description: new FormControl<string>("", [Validators.maxLength(4096)]),
        templateId: new FormControl<number>(-1, [Validators.required]),
        parentId: new FormControl<number|null>(null, []),
        groupList: new FormArray<FormControl>([]),
        fieldList: new FormArray<FormControl>([])
    });

    override labelGroup = {
        name: "Nom :",
        description: "Description :",
        parentId: "Groupe parent :"
    };

    get id() { return this.formGroup.get('id') as FormControl<number|null>; }
    get name() { return this.formGroup.get('name') as FormControl<string>; }
    get description() { return this.formGroup.get('description') as FormControl<string>; }
    get templateId() { return this.formGroup.get('templateId') as FormControl<number>; }
    get parentId() { return this.formGroup.get('parentId') as FormControl<number|null>; }
    get groupList() { return this.formGroup.get('groupList') as FormArray<FormControl>; }
    get fieldList() { return this.formGroup.get('fieldList') as FormArray<FormControl>; }

    get groupDtoList() {
        const output: { id: number }[] = [];
        const groupListWithId = Object.values(this.originGroupControlList);

        this.groupList.controls.forEach((control) => {
            const id = groupListWithId.find((group) => group.control === control)?.id;
            
            if(id !== undefined) {
                output.push({ id });
            }
        });

        return output;
    }

    get fieldDtoList() {
        const output: { id: number }[] = [];
        const fieldListWithId = Object.values(this.originFieldControlList); 

        this.fieldList.controls.forEach((control) => {
            const id = fieldListWithId.find((field) => field.control === control)?.id;

            if(id !== undefined) {
                output.push({ id });
            }
        });

        return output;
    }

    override reset(): void {
        super.reset();
        this.groupList.clear();
        this.fieldList.clear();
        
        this.id.setValue(-1);
        this.templateId.setValue(-1);
        this.name.setValue("");
        this.description.setValue("");
        this.parentId.setValue(null);

        if(this.origin) {
            this.id.setValue(this.origin.id);
            this.name.setValue(this.origin.name);
            this.description.setValue(this.origin.description);
            this.templateId.setValue(this.origin.templateId);
            this.parentId.setValue(this.origin.parentId!);

            this.originGroupControlList = [];

            this.origin.groupList.forEach((child) => {
                const childControl: FormControl<string|null> = new FormControl(child.name);
                this.groupList.push(childControl);
                this.originGroupControlList.push({ id: child.id!, control: childControl });
            });

            this.origin.fieldList.forEach((child) => {
                const childControl: FormControl<string|null> = new FormControl(child.name);
                this.fieldList.push(childControl);
                this.originFieldControlList.push({ id: child.id!, control: childControl });
            })
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

export const GROUP_CREATE_FORM = new GroupForm();
export const GROUP_UPDATE_FORM = new GroupForm();
export const GROUP_SORT_FORM = new GroupForm();