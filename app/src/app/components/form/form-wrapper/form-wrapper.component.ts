import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Form } from 'src/app/classes/form';
import { InputLabelComponent } from '../inputs/input-label/input-label.component';
import { InputPasswordComponent } from '../inputs/input-password/input-password.component';

@Component({
  selector: 'app-form-wrapper',
  templateUrl: './form-wrapper.component.html',
  styleUrls: ['./form-wrapper.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputLabelComponent,
    InputPasswordComponent
  ],
  standalone: true
})
export class FormWrapperComponent {
  @Input({ required:true })
  form!: Form;
}
