import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonButton, IonIcon, IonHeader, IonModal, IonToolbar, IonTitle, IonButtons, IonContent } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { ISelectValue } from 'src/app/v1/interface/app.interface';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonIcon,
    IonHeader,
    IonModal,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonContent,
    CommonModule
  ]
})
export class SelectComponent {
  @Input()
  control: FormControl = new FormControl();

  @Input()
  label?: string;

  @Input()
  valueList: ISelectValue[] = [];

  @Input()
  required: boolean = false;

  @Output()
  change = new EventEmitter<ISelectValue|null>();

  readonly focus = signal<boolean>(false);
  readonly selected = signal<ISelectValue|null>(null);
  private subscription?: Subscription;

  ngOnInit(): void {
    this.selected.set(this.valueList.find(v => v.dto.id === this.control.value) ?? null);

    console.log(this.valueList.find(v => v.dto.id === this.control.value));
    console.log(this.control.value);

    this.subscription = this.control.valueChanges.subscribe(value => {
      this.selected.set(this.valueList.find(v => v.dto.id === value) ?? null);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
  
  select(value: ISelectValue | null) {
    this.control.setValue(value?.dto.id ?? null);
    this.focus.set(false);
    this.change.emit(value);
  }
}
