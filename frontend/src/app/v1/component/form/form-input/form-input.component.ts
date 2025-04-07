import { Component, inject, Input } from "@angular/core";
import { FormArray, FormControl, ReactiveFormsModule } from "@angular/forms";
import { TypeService } from "src/app/v1/service/api/type.service";
import { IonDatetime } from "@ionic/angular/standalone";
import { EnumeratorValueSelectComponent } from "../../enumerator/enumerator-value-select/enumerator-value-select.component";
import { ImageSelectComponent } from "../../image/image-select/image-select.component";
import { FormValueSelectComponent } from "../form-value-select/form-value-select.component";

@Component({
  selector: "app-form-input",
  templateUrl: "./form-input.component.html",
  styleUrls: ["./form-input.component.scss"],
  standalone: true,
  imports: [
    IonDatetime,
    ReactiveFormsModule,
    EnumeratorValueSelectComponent,
    ImageSelectComponent,
    FormValueSelectComponent
],
})
export class FormInputComponent {
  @Input()
  control: FormControl|FormArray<FormControl> = new FormControl();

  @Input()
  typeId = 0;

  @Input()
  enumeratorId: number|null = null;

  @Input()
  unitId: number|null = null;

  @Input()
  unitControl?: FormControl|FormArray<FormControl>;

  @Input()
  required = false;

  @Input()
  multiple = false;

  readonly typeService = inject(TypeService);

  get iterable() {
    return this.control instanceof FormArray;
  }

  get farrControl() {
    return this.control as FormArray<FormControl>;
  }

  get formControl() {
    return this.control as FormControl;
  }
}
