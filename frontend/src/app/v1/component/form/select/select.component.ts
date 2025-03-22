import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, signal, SimpleChanges } from '@angular/core';
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
export class SelectComponent implements OnInit, OnDestroy, OnChanges {
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

    this.subscription = this.control.valueChanges.subscribe(value => {
      this.selected.set(this.valueList.find(v => v.dto.id === value) ?? null);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['valueList']) {
      this.selected.set(this.valueList.find(v => v.dto.id === this.control.value) ?? null);
    }
  }
  
  select(value: ISelectValue | null) {
    this.control.setValue(value?.dto.id ?? null);
    this.focus.set(false);
    this.change.emit(value);
  }

  valueIcon(value: ISelectValue) {
    if(this.control.value === value.dto.id) {
      return 'radio-button-on';
    } else if(value.disabled) {
      return '';
    } else {
      return 'radio-button-off';
    }
  }

  depthPadding(depth: number) {
    return depth * 14;
  }

  depthColor(depth: number) {
    const depthColors = [
      "#FFFFFF",
      "#FEFEFE",
      "#F6F6F6",
      "#F2F2F2",
      "#EDEDED",
      "#E9E9E9",
      "#E5E5E5",
      "#E1E1E1",
      "#DDDDDD"
    ];

    return depthColors[depth];
  }
}
