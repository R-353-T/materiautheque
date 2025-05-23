import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal, ViewEncapsulation, WritableSignal } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class InputComponent {
  @Input()
  control: FormControl|FormArray<FormControl> = new FormControl();

  @Input()
  label?: string;

  @Input()
  errors: string[] = [];

  @Input()
  hints: string[] = [];
}
