import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IonToggle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-input-boolean',
  templateUrl: './input-boolean.component.html',
  styleUrls: ['./input-boolean.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonToggle
  ]
})
export class InputBooleanComponent {

  @Input()
  control = new FormControl();

  @Input()
  label: string = "";

  @Input()
  errorText: boolean | string = false;

  @Input()
  infoText: boolean | string = false;

}
