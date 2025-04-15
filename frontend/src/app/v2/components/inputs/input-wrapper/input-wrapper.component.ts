import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormInput } from 'src/app/v2/core/abstracts/input';

@Component({
  selector: 'input-wrapper',
  templateUrl: './input-wrapper.component.html',
  styleUrls: ['./input-wrapper.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class InputWrapperComponent {
  @Input()
  input!: FormInput;
}
