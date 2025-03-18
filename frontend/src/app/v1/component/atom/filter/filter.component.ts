import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValueDto } from 'src/app/v1/model/value-dto';
import { IonButton, IonIcon, IonHeader, IonModal, IonToolbar, IonTitle, IonButtons, IonContent, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { IFilterValue } from 'src/app/v1/interface/app.interface';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonIcon,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonContent,
    CommonModule
  ]
})
export class FilterComponent implements OnInit, OnDestroy {
  @Input()
  control: FormControl = new FormControl();

  @Input()
  label?: string;

  @Input()
  valueList: IFilterValue[] = [];

  @Input()
  required: boolean = false;

  @Input()
  errors: string[] = [];

  @Output()
  change = new EventEmitter();

  readonly focus = signal<boolean>(false);
  readonly selected = signal<IFilterValue|null>(null);

  private subscription?: Subscription;

  ngOnInit(): void {
    this.subscription = this.control.valueChanges.subscribe(value => {
      this.selected.set(this.valueList.find(v => v.dto.id === value) ?? null);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
  
  select(value: { dto: ValueDto, disabled: boolean } | null) {
    this.control.setValue(value?.dto.id ?? null);
    this.focus.set(false);
    this.change.emit();
  }
}
