import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormInput } from 'src/app/classes/form-input';

@Component({
  selector: 'app-input-wrapper',
  templateUrl: './input-wrapper.component.html',
  styleUrls: ['./input-wrapper.component.scss'],
  imports: [
    CommonModule
  ],
  standalone: true,
})
export class InputWrapperComponent {
  @Input({ required: true })
  input!: FormInput;
}
