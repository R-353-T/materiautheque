import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonButton, IonSpinner } from '@ionic/angular/standalone';

@Component({
  selector: 'app-submit-button',
  templateUrl: './submit-button.component.html',
  styleUrls: ['./submit-button.component.scss'],
  standalone: true,
  imports: [ IonButton, IonSpinner ]
})
export class SubmitButtonComponent  implements OnInit {

  @Input() enabled = true;
  @Input() label = 'Envoyer';

  @Output() submit = new EventEmitter<void>();

  ngOnInit() {}

  onSubmit() {
    this.submit.emit();
  }
}
