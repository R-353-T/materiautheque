import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { InputWrapperComponent } from "../input-wrapper/input-wrapper.component";
import { FormInput } from 'src/app/v2/core/abstracts/input';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'input-label',
  templateUrl: './input-label.component.html',
  styleUrls: ['./input-label.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputWrapperComponent,
]
})
export class InputLabelComponent {
  @Input()
  input!: FormInput;
}
