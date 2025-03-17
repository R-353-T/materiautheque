import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseForm2 } from "../class/baseform2";
import { IImage } from "../interface/image.interface";

export class FImage extends BaseForm2 {
    
    override formGroups: { [form_name: string]: FormGroup<any>; } = {
        image: new FormGroup({
            id: new FormControl<number|null>(null, []),
            name: new FormControl<string|null>("", [Validators.required, Validators.maxLength(255)])
        })
    }

    public constructor(requiredFile: boolean = true) {
        super();

        if(requiredFile) {
            this.formGroups['image'].addControl('file', new FormControl<string|null>(null, [Validators.required]));
        } else {
            this.formGroups['image'].addControl('file', new FormControl<string|null>(null, []));
        }
    }

    override formLabels: { [form_name: string]: { [input_name: string]: string; }; } = {
        image: {
            name: "Nom de l'image",
            file: "Fichier"
        }
    }

    get formGroup() { return this.formGroups['image']; }
    get id() { return this.formGroups['image'].get('id') as FormControl; }
    get name() { return this.formGroups['image'].get('name') as FormControl; }
    get file() { return this.formGroups['image'].get('file') as FormControl; }

    private _file?: File;

    set fileValue(file: File|undefined) {
        this._file = file;

        if (file) {
            this.file.setValue(file.name);
        } else {
            this.file.setValue(null);
        }
    }

    get fileValue() {
        return this._file;
    }

    override reset(from?: IImage): void {
        super.reset();
        this._file = undefined;

        if(from) {
            this.id.setValue(from.id);
            this.name.setValue(from.name);
        }
    }

    override httpError(error: any): void {
        if(error.error && typeof error.error === "string" && error.error.includes("limit")) {
            this.file.setErrors({ file_too_large: true });
        } else {
            super.httpError(error);
        }
    }

    onChangeFile(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files?.length) {
            this.fileValue = input.files[0];
        } else {
            this.fileValue = undefined;
        }
    }

}

export const FORM__IMAGE = new FImage();
export const FORM__IMAGE__UPDATE = new FImage(false);