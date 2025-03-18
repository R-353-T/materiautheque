import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  IonButton,
  IonInput,
  IonIcon,
} from '@ionic/angular/standalone';
import { FUnit } from 'src/app/v1/form/f.unit';
import { InputComponent } from "../../input/input.component";

@Component({
  selector: 'app-unit-input-value-list',
  templateUrl: './unit-input-value-list.component.html',
  styleUrls: ['./unit-input-value-list.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonIcon,
    ReactiveFormsModule,
    InputComponent
]
})
export class UnitInputValueListComponent {
  @Input() baseForm!: FUnit;
}
