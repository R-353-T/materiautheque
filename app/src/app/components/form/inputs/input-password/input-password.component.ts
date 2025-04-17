import { Component, Input } from '@angular/core';
import { FormInput } from 'src/app/classes/form-input';
import { InputWrapperComponent } from '../input-wrapper/input-wrapper.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-password',
  templateUrl: './input-password.component.html',
  styleUrls: ['./input-password.component.scss'],
  imports: [
    InputWrapperComponent,
    CommonModule,
    ReactiveFormsModule
  ],
  standalone: true,
})
export class InputPasswordComponent {
  @Input({ required: true })
  input!: FormInput;
}
