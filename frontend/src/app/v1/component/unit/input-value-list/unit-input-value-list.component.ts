import { Component, Input } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { IonButton, IonIcon, IonInput } from "@ionic/angular/standalone";
import { FUnit } from "src/app/v1/form/f.unit";
import { InputComponent } from "../../atom/input/input.component";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-unit-input-value-list",
  templateUrl: "./unit-input-value-list.component.html",
  styleUrls: ["./unit-input-value-list.component.scss"],
  standalone: true,
  imports: [
    IonButton,
    IonIcon,
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
  ],
})
export class UnitInputValueListComponent {
  @Input()
  baseForm!: FUnit;
}
