import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseForm2 } from "../class/baseform2"
import { IField } from "../interface/field.interface";
import { TypeEnum } from "../enum/Type";

export class FField extends BaseForm2
{
    override formGroups: { [form_name: string]: FormGroup<any>; } = {
        field: new FormGroup({
            id: new FormControl<number|null>(null, []),
            name: new FormControl<string>("", [Validators.required, Validators.maxLength(255)]),
            description: new FormControl<string>("", [Validators.maxLength(4096)]),
            allowMultipleValues: new FormControl<boolean>(false, []),
            isRequired: new FormControl<boolean>(false, []),
            groupId: new FormControl<number|null>(null, [Validators.required]),
            typeId: new FormControl<number|null>(1, [Validators.required]),        
            enumeratorId: new FormControl<number|null>(null, []),
            unitId: new FormControl<number|null>(null, []),
        })
    }

    override formLabels: { [form_name: string]: { [input_name: string]: string; }; } = {
        field: {
            name: "Nom",
            description: "Description",
            allowMultipleValues: "Valeurs multiples",
            isRequired: "Obligatoire",
            groupId: "Groupe",
            position: "Position",
            typeId: "Type",
            enumeratorId: "Énumération",
            unitId: "Unité",
        }
    }

    get formGroup() { return this.formGroups['field']; }
    get id() { return this.formGroup.get('id') as FormControl; }
    get name() { return this.formGroup.get('name') as FormControl; }
    get description() { return this.formGroup.get('description') as FormControl; }
    get allowMultipleValues() { return this.formGroup.get('allowMultipleValues') as FormControl<boolean>; }
    get isRequired() { return this.formGroup.get('isRequired') as FormControl<boolean>; }
    get groupId() { return this.formGroup.get('groupId') as FormControl; }
    get typeId() { return this.formGroup.get('typeId') as FormControl; }
    get enumeratorId() { return this.formGroup.get('enumeratorId') as FormControl; }
    get unitId() { return this.formGroup.get('unitId') as FormControl; }

    override reset(from?: IField): void {
        super.reset();
        this.formGroup.enable();
        this.typeId.setValue(1);
        this.allowMultipleValues.setValue(false);
        this.isRequired.setValue(false);

        if(from) {
            this.id.setValue(from.id);
            this.name.setValue(from.name);
            this.description.setValue(from.description);
            this.allowMultipleValues.setValue(from.allowMultipleValues);
            this.isRequired.setValue(from.isRequired);
            this.groupId.setValue(from.groupId);
            this.typeId.setValue(from.typeId);
            this.enumeratorId.setValue(from.enumeratorId);
            this.unitId.setValue(from.unitId);
        }

        this.changes();
    }

    changes() {
        if(this.enumeratorId.value !== null) {
            this.typeId.setValue(TypeEnum.ENUMERATOR);
            this.unitId.setValue(null);
            this.typeId.disable();
            this.unitId.disable();
        } else {
            if(this.typeId.value === TypeEnum.ENUMERATOR) {
                this.typeId.setValue(1);
            }

            this.unitId.setValue(null);
            this.typeId.enable();
            this.unitId.enable();
        }

        // todo - $ - move in backend - $ -

        const notUnitable = [
            TypeEnum.DATE,
            TypeEnum.BOOLEAN,
            TypeEnum.URL,
            TypeEnum.IMAGE,
            TypeEnum.FORM,
            TypeEnum.ENUMERATOR
        ];

        // todo - $ - move in backend - $ -

        const typeId = this.typeId.value;

        if(typeId !== null) {
            if(notUnitable.includes(typeId)) {
                this.unitId.disable();
                this.unitId.setValue(null);
            } else {
                this.unitId.enable();
            }
        }
    }
}

export const FORM__FIELD = new FField();