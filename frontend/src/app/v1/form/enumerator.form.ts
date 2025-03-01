import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseForm } from "../class/baseform";
import { IEnumerator } from "../interface/enumerator.interface";
import { UrlValidator } from "src/app/v1/validators/url.validator";
import { NumericValidator } from "src/app/v1/validators/numeric.validator";
import { DateValidator } from "src/app/v1/validators/date.valitator";
import { TypeEnum } from "../enum/Type";
import { ValueDto } from "../model/value-dto";

export class EnumeratorForm extends BaseForm<IEnumerator> {

    constructor() {
        super();
        this.errors["duplicate"] = "Ce nom est déjà utilisé";
    }

    originValueControlList: { id: number, control: FormControl<string | number> }[] = []

    override formGroup: FormGroup<any> = new FormGroup({
        id: new FormControl<number>(-1, [Validators.required]),
        name: new FormControl<string>("", [Validators.required, Validators.maxLength(255)]),
        description: new FormControl<string>("", [Validators.maxLength(4096)]),
        typeId: new FormControl<number>(1, [Validators.required]),
        valueList: new FormArray<FormControl>([])
    })

    override labelGroup = {
        name: "Nom :",
        description: "Description :",
        typeId: "Type :",
        valueList: "Valeurs :"
    };

    get id() { return this.formGroup.get('id') as FormControl<number>; }
    get name() { return this.formGroup.get('name') as FormControl<string>; }
    get description() { return this.formGroup.get('description') as FormControl<string>; }
    get typeId() { return this.formGroup.get('typeId') as FormControl<number>; }
    get valueList() { return this.formGroup.get('valueList') as FormArray<FormControl>; }

    get valueDtoList() {
        return this.valueList.controls.map(
            control => {
                const id = this.originValueControlList.find((val) => val.control === control)?.id ?? null;
                
                const dto = new ValueDto();
                dto.id = id;
                dto.value = control.value;
                return dto;
            }
        )
    }

    override reset(): void {
        super.reset();
        this.id.setValue(-1);
        this.typeId.setValue(1);
        this.valueList.clear();

        if (this.origin !== undefined) {
            this.id.setValue(this.origin.id);
            this.name.setValue(this.origin.name);
            this.description.setValue(this.origin.description);
            this.typeId.setValue(this.origin.typeId);

            this.originValueControlList = [];

            this.origin.valueList.forEach((value) => {
                const control = new FormControl(
                    value.value,
                    this.valueValidators(this.origin!.typeId)
                );

                this.valueList.push(control);
                this.originValueControlList.push({ id: value.id!, control });
            });
        }
    }

    valueValidators(typeId: number) {
        const r = [Validators.required];

        switch (typeId) {
            case (TypeEnum.LABEL):
                r.push(Validators.maxLength(255));
                break;

            case (TypeEnum.TEXT):
                r.push(Validators.maxLength(65535));
                break;

            case (TypeEnum.URL):
                r.push(Validators.maxLength(4096), UrlValidator());
                break;

            case (TypeEnum.NUMBER):
                r.push(Validators.min(-9999999999), Validators.max(9999999999));
                break;

            case (TypeEnum.MONEY):
                r.push(NumericValidator());
                break;

            case (TypeEnum.DATE):
                r.push(DateValidator());
                break;
        }

        return r;
    }

    addValue() {
        this.valueList.push(new FormControl("", this.valueValidators(this.typeId.value)));
    }

    removeValueAt(index: number) {
        this.valueList.removeAt(index);
    }

    moveValueUp(index: number) {
        if (index > 0) {
            const value = this.valueList.at(index);
            this.valueList.removeAt(index);
            this.valueList.insert(index - 1, value);
        }
    }

    moveValueDown(index: number) {
        if (index < this.valueList.length - 1) {
            const value = this.valueList.at(index);
            this.valueList.removeAt(index);
            this.valueList.insert(index + 1, value);
        }
    }
}

export const ENUMERATOR_CREATE_FORM = new EnumeratorForm();
export const ENUMERATOR_UPDATE_FORM = new EnumeratorForm();