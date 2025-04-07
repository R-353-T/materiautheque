import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseForm2 } from "../class/baseform2";
import { ITemplate } from "../interface/template.interface";
import { IForm } from "../interface/form.interface";
import { signal } from "@angular/core";
import { FFormGroup } from "./f.form-group";

export class FForm extends BaseForm2 {

    override formGroups: { [form_name: string]: FormGroup<any>; } = {
        form: new FormGroup({
            id: new FormControl<number | null>(null, []),
            name: new FormControl<string | null>("", [
                Validators.required,
                Validators.maxLength(255),
            ]),
            templateId: new FormControl<number | null>(null, [Validators.required]),
        })
    };

    get formGroup() { return this.formGroups['form']; }
    get id() { return this.formGroup.get('id') as FormControl; }
    get name() { return this.formGroup.get('name') as FormControl; }
    get templateId() { return this.formGroup.get('templateId') as FormControl; }

    override formLabels: { [form_name: string]: { [input_name: string]: string; }; } = {
        form: {
            name: "Nom",
        }
    }

    groups = signal<FFormGroup[]>([]);

    override reset(template?: ITemplate, from?: IForm): void {
        super.reset();
        this.lock();
        this.id.setValue(null);
        this.name.setValue(null);
        this.templateId.setValue(null);
        this.groups.set([]);

        if(template) {
            this.loadTemplate(template, from);
        }

        if(from) {
            this.loadForm(from);
        }

        this.unlock();
    }

    getGroupById(id: number) {
        return this.groups().find(group => group.group.id === id);
    }

    private loadTemplate(template: ITemplate, form?: IForm) {
        template.groupList?.forEach((group) => {
            this.groups.update(groups => {
                const forms = FFormGroup.loadGroup(group);
                groups.push(...forms);
                return groups;
            });
        });
    }

    loadForm(from: IForm) {
        this.id.setValue(from.id);
        this.name.setValue(from.name);
        this.templateId.setValue(from.templateId);
    }
}

export const FORM__FORM = new FForm();