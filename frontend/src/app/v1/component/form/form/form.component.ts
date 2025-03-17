import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class FormComponent implements OnInit, OnDestroy {
  @Input()
  formGroup: FormGroup = new FormGroup({});
  
  @Input()
  errors: string[] = [];

  private valueChangesSubscription?: Subscription;

  ngOnInit(): void {
    this.valueChangesSubscription = this.formGroup.valueChanges.subscribe((value) => {});
  }

  ngOnDestroy(): void {
    this.valueChangesSubscription?.unsubscribe();
  }
}
