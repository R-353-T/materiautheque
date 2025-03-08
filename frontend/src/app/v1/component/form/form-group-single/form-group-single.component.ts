import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IonInput, IonToggle } from '@ionic/angular/standalone';
import { TypeService } from 'src/app/v1/service/api/type.service';
import { InputTextareaComponent } from '../input-textarea/input-textarea.component';
import { InputDateComponent } from '../input-date/input-date.component';
import { IField } from 'src/app/v1/interface/field.interface';
import { EMPTY_FORM } from 'src/app/v1/form/empty.form';
import { InputBooleanComponent } from "../input-boolean/input-boolean.component";

@Component({
  selector: 'app-form-group-single',
  templateUrl: './form-group-single.component.html',
  styleUrls: ['./form-group-single.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    IonInput,
    InputTextareaComponent,
    InputDateComponent,
    InputBooleanComponent
]
})
export class FormGroupSingleComponent {

  @Input()
  control?: FormControl;

  @Input()
  field?: IField;

  typeService = inject(TypeService);
  form = EMPTY_FORM;

}
