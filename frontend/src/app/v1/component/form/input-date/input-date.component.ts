import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { IonDatetime } from "@ionic/angular/standalone";

@Component({
  selector: "app-input-date",
  templateUrl: "./input-date.component.html",
  styleUrls: ["./input-date.component.scss"],
  standalone: true,
  imports: [
    IonDatetime,
    ReactiveFormsModule,
    CommonModule
  ],
})
export class InputDateComponent {
  @Input()
  control = new FormControl();

  @Input()
  label: string = "";

  @Input()
  errorText: boolean | string = false;

  @Input()
  infoText: boolean | string = false;
}
