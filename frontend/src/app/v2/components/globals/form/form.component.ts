import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Form } from 'src/app/v2/core/abstracts/baseform';
import { InputLabelComponent } from '../../inputs/input-label/input-label.component';
import { InputPasswordComponent } from '../../inputs/input-password/input-password.component';

@Component({
  selector: 'form-wrapper',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputLabelComponent,
    InputPasswordComponent
  ]
})
export class FormComponent {
  @Input()
  form: Form = new Form("");
}
