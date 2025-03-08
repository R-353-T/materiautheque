import { Component, computed, Input, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
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
import { Form } from 'src/app/v1/form/form';
import { interval, Subscription } from 'rxjs';

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
export class FormGroupSummaryComponent implements OnInit, OnDestroy {

  @Input()
  form?: Form;

  @Input()
  activeGroupId: WritableSignal<number> = signal(0);

  readonly active = computed(() => {
    return this.form?.getSection(this.activeGroupId());
  });

  readonly isActive = signal<boolean>(false);

  private intervalSubscription?: Subscription;

  ngOnInit(): void {
    this.intervalSubscription = interval(1500).subscribe(() => {
      this.form?.validateAll();
    });
  }

  ngOnDestroy(): void {
    this.intervalSubscription?.unsubscribe();
  }

  select(id: number) {
    this.activeGroupId.set(id);
    this.isActive.set(false);
  }

}
