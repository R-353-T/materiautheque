import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-group-multiple',
  templateUrl: './form-group-multiple.component.html',
  styleUrls: ['./form-group-multiple.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class FormGroupMultipleComponent {}
