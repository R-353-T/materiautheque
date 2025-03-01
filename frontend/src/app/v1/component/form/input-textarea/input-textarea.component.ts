import { Component, Input } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { IonTextarea } from "@ionic/angular/standalone";

@Component({
  selector: "app-input-textarea",
  templateUrl: "./input-textarea.component.html",
  styleUrls: ["./input-textarea.component.scss"],
  standalone: true,
  imports: [
    IonTextarea,
    ReactiveFormsModule,
  ],
})
export class InputTextareaComponent {
  @Input()
  control = new FormControl();

  @Input()
  label: string = "";

  @Input()
  errorText: boolean | string = false;

  @Input()
  infoText: boolean | string = false;
}
