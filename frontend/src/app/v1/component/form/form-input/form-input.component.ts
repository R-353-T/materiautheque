import { Component, inject, Input, OnInit } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { TypeService } from "src/app/v1/service/api/type.service";
import { IonDatetime } from "@ionic/angular/standalone";

@Component({
  selector: "app-form-input",
  templateUrl: "./form-input.component.html",
  styleUrls: ["./form-input.component.scss"],
  standalone: true,
  imports: [
    IonDatetime,
    ReactiveFormsModule,
  ],
})
export class FormInputComponent {
  @Input()
  control = new FormControl();

  @Input()
  typeId = 0;

  readonly typeService = inject(TypeService);
}
