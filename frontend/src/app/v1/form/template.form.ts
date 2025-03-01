import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseForm } from "../class/baseform";
import { ITemplate } from "../interface/template.interface";

export class TemplateForm extends BaseForm<ITemplate> {

    originGroupControlList: { id:number, control: FormControl<string|null> }[] = [];

    override formGroup = new FormGroup({
        id: new FormControl<number|null>(null, [Validators.required]),
        name: new FormControl<string>("", [Validators.required, Validators.maxLength(255)]),
        groupList: new FormArray<FormControl>([])
    });

    override labelGroup = {
        name: "Nom :",
        groupList: "Groupes :"
    }

    get id() { return this.formGroup.get('id') as FormControl<number|null>; }
    get name() { return this.formGroup.get('name') as FormControl<string>; }
    get groupList() { return this.formGroup.get('groupList') as FormArray<FormControl>; }

    get groupDtoList() {
        const output: { id: number }[] = [];
        const groupListWithId = Object.values(this.originGroupControlList);

        this.groupList.controls.forEach((control) => {
            const id = groupListWithId.find((group) => group.control === control)?.id;
            
            if(id !== undefined) {
                output.push({ id });
            }
        })

        return output;
    }

    override reset(): void {
        super.reset();
        this.groupList.clear();
        this.id.setValue(-1);
        this.name.setValue("");
        this.name.disable();

        if(this.origin) {
            this.id.setValue(this.origin.id);
            this.name.setValue(this.origin.name);

            this.origin.groupList!.forEach((child) => {
                const childControl: FormControl<string|null> = new FormControl(child.name);
                this.groupList.push(childControl);
                this.originGroupControlList.push({ id: child.id!, control: childControl });
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

}

export const TEMPLATE_UPDATE_FORM = new TemplateForm();