import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FGroup } from 'src/app/v1/form/form-group.form';
import { TypeService } from 'src/app/v1/service/api/type.service';
import { FormGroupSingleComponent } from "../form-group-single/form-group-single.component";
import { FormGroupMultipleComponent } from '../form-group-multiple/form-group-multiple.component';

@Component({
  selector: 'app-form-group-content',
  templateUrl: './form-group-content.component.html',
  styleUrls: ['./form-group-content.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormGroupSingleComponent,
    FormGroupMultipleComponent
  ]
})
export class FormGroupContentComponent {
  @Input()
  fgroup?: FGroup;

  typeService = inject(TypeService);

  getControl(id: string) {
    return this.fgroup?.formGroup.controls[id] as FormControl;
  }
}
