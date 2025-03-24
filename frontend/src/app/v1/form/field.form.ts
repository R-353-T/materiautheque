import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseForm } from "../class/baseform";
import { IField } from "../interface/field.interface";
import { TypeEnum } from "../enum/Type";

export class FieldForm extends BaseForm<IField> {
    constructor() {
        super();
        this.errors["type_not_unitable"] = "";
        this.errors["type_not_multiple"] = "";
    }

    override formGroup = new FormGroup({
        id: new FormControl<number>(-1, [Validators.required]),
        name: new FormControl<string>("", [Validators.required, Validators.maxLength(255)]),
        description: new FormControl<string>("", [Validators.maxLength(4096)]),
        allowMultipleValues: new FormControl<boolean>(false, []),
        isRequired: new FormControl<boolean>(false, []),
        groupId: new FormControl<number>(-1, [Validators.required]),
        typeId: new FormControl<number|null>(-1, [Validators.required]),        
        enumeratorId: new FormControl<number|null>(null, []),
        unitId: new FormControl<number|null>(null, []),
    });

    override labelGroup = {
        name: "Nom :",
        description: "Description :",
        allowMultipleValues: "Valeurs multiples :",
        isRequired: "Obligatoire :",
        groupId: "Groupe :",
        position: "Position :",
        typeId: "Type :",
        enumeratorId: "Énumération :",
        unitId: "Unité :",
    };

    get id() { return this.formGroup.get('id') as FormControl<number>; }
    get name() { return this.formGroup.get('name') as FormControl<string>; }
    get description() { return this.formGroup.get('description') as FormControl<string>; }
    get allowMultipleValues() { return this.formGroup.get('allowMultipleValues') as FormControl<boolean>; }
    get isRequired() { return this.formGroup.get('isRequired') as FormControl<boolean>; }
    get groupId() { return this.formGroup.get('groupId') as FormControl<number>; }
    get typeId() { return this.formGroup.get('typeId') as FormControl<number|null>; }
    get enumeratorId() { return this.formGroup.get('enumeratorId') as FormControl<number|null>; }
    get unitId() { return this.formGroup.get('unitId') as FormControl<number|null>; }

    override reset(): void {
        super.reset();

        if(this.origin) {
            this.id.setValue(this.origin.id);
            this.name.setValue(this.origin.name);
            this.description.setValue(this.origin.description);
            this.allowMultipleValues.setValue(this.origin.allowMultipleValues);
            this.isRequired.setValue(this.origin.isRequired);
            this.groupId.setValue(this.origin.groupId);
            this.typeId.setValue(this.origin.typeId);
            this.updateType();
            
            this.unitId.setValue(this.origin.unitId);
            this.enumeratorId.setValue(this.origin.enumeratorId);

            if(this.origin.enumeratorId !== null) {
                this.updateEnumerator();
            }
        } else {
            this.id.setValue(-1);
            this.name.setValue("");
            this.description.setValue("");
            this.allowMultipleValues.setValue(false);
            this.isRequired.setValue(false);
            this.groupId.setValue(-1);
            this.typeId.setValue(1);
            this.enumeratorId.setValue(null);
            this.unitId.setValue(null);
        }
    }

    updateEnumerator() {
        if(this.enumeratorId.value !== null) {
            this.typeId.disable();
            this.unitId.disable();
            this.typeId.setValue(TypeEnum.ENUMERATOR);
            this.unitId.setValue(null);
        } else {
            this.typeId.enable();
            this.unitId.enable();
            this.typeId.setValue(1);
        }
    }

    updateType() {
        const notUnitable = [
            TypeEnum.DATE,
            TypeEnum.BOOLEAN,
            TypeEnum.URL,
            TypeEnum.IMAGE,
            TypeEnum.FORM,
            TypeEnum.ENUMERATOR
        ]; // todo - $ - move in backend

        const id = this.typeId.value;
        if(id !== null) {
            if(notUnitable.includes(id)) {
                this.unitId.disable();
                this.unitId.setValue(null);
            } else {
                this.unitId.enable();
            }
        }
    }
}

export const FIELD_CREATE_FORM = new FieldForm();
export const FIELD_UPDATE_FORM = new FieldForm();