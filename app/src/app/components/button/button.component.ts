import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  imports: [
    IonIcon,
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

  @Output()
  onClick = new EventEmitter<void>();

  onClickEvent() {
    if (this.disabled === false) {
      this.onClick.emit();
    }
  }
}
