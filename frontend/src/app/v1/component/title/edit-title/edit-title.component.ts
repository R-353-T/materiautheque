import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-edit-title',
  templateUrl: './edit-title.component.html',
  styleUrls: ['./edit-title.component.scss'],
  standalone: true,
  imports: [
    IonButton
  ],
})
export class EditTitleComponent {
  @Input()
  title: string = '';

  @Input()
  id: string|number = '';

  @Input()
  buttonDisabled: boolean = false;

  @Output()
  onClick = new EventEmitter<void>();
}
