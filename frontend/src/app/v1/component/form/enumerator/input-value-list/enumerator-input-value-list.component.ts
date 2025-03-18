import { Component, Input } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { FEnumerator } from "src/app/v1/form/f.enumerator";
import { InputComponent } from "../../input/input.component";
import { FormInputComponent } from "../../form-input/form-input.component";

@Component({
  selector: "app-enumerator-input-value-list",
  templateUrl: "./enumerator-input-value-list.component.html",
  styleUrls: ["./enumerator-input-value-list.component.scss"],
  standalone: true,
  imports: [
    IonButton,
    IonIcon,
    ReactiveFormsModule,
    InputComponent,
    FormInputComponent,
  ],
})
export class InputValueListComponent {
  @Input()
  baseForm!: FEnumerator;
}
