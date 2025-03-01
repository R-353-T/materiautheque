import { Component, inject, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  IonButton,
  IonInput,
  IonIcon
} from '@ionic/angular/standalone';
import { TypeService } from 'src/app/v1/service/api/type.service';
import { EnumeratorForm } from 'src/app/v1/form/enumerator.form';
import { InputTextareaComponent } from '../../input-textarea/input-textarea.component';
import { InputDateComponent } from '../../input-date/input-date.component';

@Component({
  selector: 'app-input-value-list',
  templateUrl: './input-value-list.component.html',
  styleUrls: ['./input-value-list.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonInput,
    IonIcon,
    InputTextareaComponent,
    InputDateComponent,
    ReactiveFormsModule
  ]
})
export class InputValueListComponent {

  @Input() form!: EnumeratorForm;

  readonly typeService = inject(TypeService);

}
