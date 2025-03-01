import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UnitForm } from 'src/app/v1/form/unit.form';
import {
  IonButton,
  IonInput,
  IonIcon,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-input-value-list',
  templateUrl: './input-value-list.component.html',
  styleUrls: ['./input-value-list.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonInput,
    IonIcon,
    ReactiveFormsModule
  ]
})
export class InputValueListComponent {

  @Input() form!: UnitForm;

}
