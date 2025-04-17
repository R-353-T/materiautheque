import { Component, Input } from '@angular/core';
import { FormInput } from 'src/app/classes/form-input';
import { InputWrapperComponent } from "../input-wrapper/input-wrapper.component";
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-label',
  templateUrl: './input-label.component.html',
  styleUrls: ['./input-label.component.scss'],
  standalone: true,
  imports: [
    InputWrapperComponent,
    CommonModule,
    ReactiveFormsModule
  ],
})
export class InputLabelComponent {
  @Input({ required: true })
  input!: FormInput;
}
