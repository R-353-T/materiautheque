import { Component, Input, OnInit } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { InputComponent } from '../../../atom/input/input.component';
import { FormInputComponent } from '../../form-input/form-input.component';
import { FGroup } from 'src/app/v1/form/f.group';
import { ReactiveFormsModule } from '@angular/forms';
import { FTemplate } from 'src/app/v1/form/f.template';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-group-input-value-list',
  templateUrl: './group-input-value-list.component.html',
  styleUrls: ['./group-input-value-list.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonIcon,
    CommonModule,
    ReactiveFormsModule,
    InputComponent
  ]
})
export class GroupInputValueListComponent {
  @Input()
  baseForm!: FGroup|FTemplate;

  label() {
    if(this.baseForm instanceof FTemplate) {
      return this.baseForm.formLabels["template"]["groupList"];
    } else  {
      return this.baseForm.formLabels["group"]["groupList"];
    }
  }
}
