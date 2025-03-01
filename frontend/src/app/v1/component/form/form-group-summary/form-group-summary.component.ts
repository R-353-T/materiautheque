import { Component, computed, Input, signal, WritableSignal } from '@angular/core';
import { FormForm } from 'src/app/v1/form/form.form';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-group-summary',
  templateUrl: './form-group-summary.component.html',
  styleUrls: ['./form-group-summary.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonModal,
    IonTitle,
    IonToolbar,
    CommonModule
  ]
})
export class FormGroupSummaryComponent {

  @Input()
  form?: FormForm;

  @Input()
  activeGroupId: WritableSignal<number> = signal(0);

  readonly active = computed(() => {
    if(this.activeGroupId() === 0) {
      return this.form?.originTemplate;
    } else {
      const fg = this.form?.groups[this.activeGroupId()];
      return fg?.group;
    }
  });

  readonly isActive = signal<boolean>(false);
  readonly isValidActive = computed(() => {
    if(this.activeGroupId() === 0) {
      return this.form?.formGroup.valid;
    } else {
      const fg = this.form?.groups[this.activeGroupId()];
      return fg?.form.formGroup.valid;
    }
  });

  select(id: number) {
    this.activeGroupId.set(id);
    this.isActive.set(false);
  }

}
