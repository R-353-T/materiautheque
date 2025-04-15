import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormInput } from "src/app/v2/core/abstracts/input";
import { InputWrapperComponent } from "../input-wrapper/input-wrapper.component";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "input-password",
  templateUrl: "./input-password.component.html",
  styleUrls: ["./input-password.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputWrapperComponent,
  ],
})
export class InputPasswordComponent {
  @Input()
  input!: FormInput;
}
