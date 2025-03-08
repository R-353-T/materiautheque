import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseForm } from "../class/baseform";
import { IForm } from "../interface/form.interface";
import { ITemplate } from "../interface/template.interface";

export class FormForm extends BaseForm<IForm> {
    sectionId = 0;
    sectionName;

    private template: ITemplate;

    constructor(template: ITemplate) {
        super();
        this.template = template;
        this.sectionName = template.name;
        this.reset();
    }

    override formGroup = new FormGroup({
        id: new FormControl<number>(-1, [Validators.required]),
        templateId: new FormControl<number>(-1, [Validators.required]),
        name: new FormControl<string>("", [
            Validators.required,
            Validators.maxLength(255),
        ]),
    });

    override labelGroup = {
        name: "Nom :",
        templateId: "Template :",
    };

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
        this.templateId.setValue(this.template.id);

        if (this.origin) {
            this.id.setValue(this.origin.id);
            this.name.setValue(this.origin.name);
        }
    }
}

