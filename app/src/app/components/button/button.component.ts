import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonSpinner, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  imports: [
    IonIcon,
    IonSpinner,
    CommonModule
  ],
  standalone: true,
})
export class ButtonComponent {
  @Input()
  label?: string;

  @Input()
  icon?: string;

  @Input()
  classes: string[] = [];

  @Input()
  disabled: boolean = false;

  @Input()
  loading: boolean = false;

  @Output()
  onClick = new EventEmitter<void>();

  onClickEvent() {
    if (this.disabled === false && this.loading === false) {
      this.onClick.emit();
    }
  }
}
