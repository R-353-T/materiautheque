import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-edit-title',
  templateUrl: './edit-title.component.html',
  styleUrls: ['./edit-title.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    CommonModule
  ],
})
export class EditTitleComponent {
  @Input()
  title: string = '';

  @Input()
  id: string|number|undefined = '';

  @Input()
  buttonDisabled: boolean = false;

  @Output()
  onClick = new EventEmitter<void>();
}
