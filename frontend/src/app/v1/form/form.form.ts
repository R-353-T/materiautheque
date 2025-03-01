import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseForm } from "../class/baseform";
import { IForm } from "../interface/form.interface";
import { ITemplate } from "../interface/template.interface";
import { IGroup } from "../interface/group.interface";
import { FormGroupForm } from "./form-group.form";

export class FormForm extends BaseForm<IForm> {
    constructor() {
        super();
    }

    originTemplate?: ITemplate;

    override formGroup = new FormGroup({
        id: new FormControl<number>(-1, [Validators.required]),
        name: new FormControl<string>("", [
            Validators.required,
            Validators.maxLength(255),
        ]),
        templateId: new FormControl<number>(-1, [Validators.required]),
    });

    override labelGroup = {
        name: "Nom :",
        templateId: "Template :",
    };

    groups: { [id:number]: {
        form: FormGroupForm,
        group: IGroup
    } } = {};

    get groupsAsArray() {
        return Object.values(this.groups);
    } 

    get id() {
        return this.formGroup.get("id") as FormControl<number>;
    }
    get name() {
        return this.formGroup.get("name") as FormControl<string>;
    }
    get templateId() {
        return this.formGroup.get("templateId") as FormControl<number>;
    }

    override reset(): void {
        super.reset();
        this.id.setValue(-1);
        this.name.setValue("");

        if (this.origin) {
            this.id.setValue(this.origin.id);
            this.name.setValue(this.origin.name);
        }
    }

    setup(template: ITemplate) {
        this.originTemplate = template;
        this.groups = {};
        template.groupList?.forEach((group) => this.rmapGroup(group));
    }

    private rmapGroup(group: IGroup, depth = 1, disabled = false) {
        this.groups[group.id] = {
            form: new FormGroupForm(group.fieldList),
            group
        };

        group.groupList?.forEach((group) => this.rmapGroup(group));
    }

    get parsedValueList() {
        return [];
    }
}

export const FORM_CREATE_FORM = new FormForm();
export const FORM_UPDATE_FORM = new FormForm();
