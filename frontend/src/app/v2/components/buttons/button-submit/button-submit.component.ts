import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonButton, IonSpinner } from '@ionic/angular/standalone';

@Component({
  selector: 'button-submit',
  templateUrl: './button-submit.component.html',
  styleUrls: ['./button-submit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonSpinner
  ]
})
export class ButtonSubmitComponent {
  @Input()
  loading = false;

  @Input()
  disabled = false;

  @Input()
  label = "Envoyer";

  @Output()
  click = new EventEmitter<void>();

  onClick() {
    if(this.loading === false && this.disabled === false) {
      this.click.emit();
    }
  }
}
