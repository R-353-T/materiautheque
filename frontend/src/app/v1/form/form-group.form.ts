import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseForm } from "../class/baseform";
import { IGroup } from "../interface/group.interface";
import { ValidatorService } from "../service/validator.service";
import { IField } from "../interface/field.interface";
import { ValueDto } from "../model/value-dto";

export class FGroup extends BaseForm<any>
{
    sectionId: number;
    sectionName: string;
    group: IGroup;
    depth: number;
    fieldGroup: { [id:string]: IField } = {};
    fieldIdList: string[] = [];

    constructor(group: IGroup, depth: number) {
        super();
        this.sectionName = group.name;
        this.sectionId = group.id;
        this.group = group as IGroup;
        this.depth = depth;
        this.initialize();
    }

    get valueList() {
        const output: ValueDto[] = [];

        Object.values(this.fieldGroup).forEach(
            (field) => {
                const fieldId = field.id;
                const vdto = new ValueDto();

                if(this.formGroup.controls[fieldId] instanceof FormControl) {
                    vdto.fieldId = fieldId;
                    vdto.value = this.formGroup.controls[fieldId].value;
                    output.push(vdto);
                } else if(this.formGroup.controls[fieldId] instanceof FormArray) {
                    this.formGroup.controls[fieldId].controls.forEach(
                        (control) => {
                            vdto.fieldId = fieldId;
                            vdto.value = control.value;
                            output.push(vdto);
                        }
                    );

                    output.push(vdto);
                }

            }
        );

        return output;
    }

    private initialize() {
        const fg: any = {};
        const fields: { [id:number]: IField } = {}

        this.group.fieldList.forEach((field) => {
            const validators = ValidatorService.validatorByTypeId(field.typeId);

            if (field.isRequired) {
                validators.push(Validators.required);
            }

            fg[field.id] = new FormControl("", validators);
            fields[field.id] = field;
            this.fieldIdList.push(field.id.toString());
        });
        
        this.fieldGroup = fields;
        this.formGroup = new FormGroup(fg);
    }
}