import { signal } from "@angular/core";
import { IForm } from "../interface/form.interface";
import { IGroup } from "../interface/group.interface";
import { ITemplate } from "../interface/template.interface";
import { ValueDto } from "../model/value-dto";
import { FGroup } from "./form-group.form";
import { FormForm } from "./form.form";

export class Form
{
    lock = signal<boolean>(false);
    template?: ITemplate;
    origin?: IForm;
    formMap: { [id: number]: FGroup|FormForm } = {}
    formMapValidation: { [id: number]: boolean } = {}

    get valueList() {
        const output: ValueDto[] = [];

        Object.values(this.formMap).forEach((value) => {
            if(value instanceof FGroup) {
                output.push(...value.valueList);
            }
        })

        return output;
    }

    get sections() {
        return Object.values(this.formMap);
    }
    
    getTemplateSection() {
        return this.formMap[0] as FormForm;
    }

    getSection (id: number) {
        return this.formMap[id];
    }

    getGroupSection (id: number) {
        return this.formMap[id] as FGroup;
    }

    open(template: ITemplate, origin?: IForm) {
        this.template = template;
        this.origin = origin;
        this.formMap = {};
        this.formMap[0] = new FormForm(template);
        template.groupList?.forEach((group) => this.loadGroup(group));
    }

    validateAll(touch = false) {
        let ok = true;

        for (const key in this.formMap) {
            if(touch) {
                this.formMap[key].formGroup.markAllAsTouched();
            }

            this.formMapValidation[key] = this.formMap[key].formGroup.valid;

            if(this.formMap[key].formGroup.valid === false) {
                ok = false;

                if(touch) {
                    console.log(this.formMap[key]);
                }
            }
        }

        return ok;
    }

    private loadGroup(group: IGroup, depth = 1) {
        this.formMap[group.id] = new FGroup(group, depth);
        group.groupList?.forEach((group) => this.loadGroup(group, depth + 1));
    }


}

export const __FORM__ = new Form();