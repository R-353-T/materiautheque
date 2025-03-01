import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseForm } from "../class/baseform";
import { IImage } from "../interface/image.interface";

export class ImageForm extends BaseForm<IImage> {
    
    public constructor() {
        super();
        this.errors["file_too_large"] = "Le fichier est trop volumineux (maximum 10 Mo)";
        this.errors["file_not_supported"] = "L'extension du fichier n'est pas pris en charge";
    }

    override formGroup = new FormGroup({
        id: new FormControl<number>(-1, [Validators.required]),
        name: new FormControl<string>("", [Validators.required, Validators.maxLength(255)]),
        file: new FormControl<string>("", []),
    });

    override labelGroup = {
        name: "Nom :",
        file: "Fichier :",
    }

    private _file?: File;

    get id() { return this.formGroup.get('id') as FormControl<number>; }
    get name() { return this.formGroup.get('name') as FormControl<string>; }
    get file() { return this.formGroup.get('file') as FormControl<string>; }

    set fileValue(file: File|undefined) {
        if(file) {
            this.file.reset();
        }
        this._file = file;
    }

    get fileValue() {
        return this._file;
    }

    override reset(): void {
        super.reset();
        this.id.setValue(-1);
        this.fileValue = undefined;

        if(this.origin) {
            this.id.setValue(this.origin.id);
            this.name.setValue(this.origin.name);
        }
    }

    override valid(requiredFile: boolean = true): boolean {
        if(requiredFile && this._file === undefined) {
            this.file.setErrors({ required: true });
        } else {
            this.file.setErrors(null);
        }

        super.valid();
        return this.formGroup.valid;
    }
}

export const IMAGE_CREATE_FORM = new ImageForm();
export const IMAGE_UPDATE_FORM = new ImageForm();