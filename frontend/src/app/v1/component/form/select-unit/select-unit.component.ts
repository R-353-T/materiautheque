import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import { UnitService } from 'src/app/v1/service/api/unit.service';
import { EMPTY_FORM } from 'src/app/v1/form/empty.form';
import { IUnit } from 'src/app/v1/interface/unit.interface';
import { InfiniteScrollOptions } from 'src/app/v1/interface/app.interface';
import { Subscription } from 'rxjs';
import { InfiniteScrollComponent } from "../../organism/infinite-scroll/infinite-scroll.component";

@Component({
  selector: 'app-select-unit',
  templateUrl: './select-unit.component.html',
  styleUrls: ['./select-unit.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonModal,
    IonTitle,
    IonToolbar,
    CommonModule,
    InfiniteScrollComponent
]
})
export class SelectUnitComponent implements OnInit, OnDestroy {
  @Input()
  control?: FormControl;

  @Input()
  label?: string;

  @Input()
  icon: string = "chevron-expand";

  readonly isActive = signal<boolean>(false);
  readonly selected = signal<IUnit | undefined>(undefined);
  readonly unitService = inject(UnitService);
  readonly form = EMPTY_FORM;
  readonly options = new InfiniteScrollOptions();
  readonly searchOption = signal<string | undefined | null>(null);
  private subscription ?: Subscription;

  ngOnInit(): void {

    if(this.control?.value && this.control?.enabled) {
      this.unitService.get(this.control.value).subscribe((unit) => {
        this.selected.set(unit);
      });
    }

    this.subscription = this.control?.valueChanges.subscribe((id) => {
      if (id && this.control?.enabled) {
        this.unitService.get(id).subscribe((unit) => {
          this.selected.set(unit);
        });
      }

      if(id === null) {
        this.selected.set(undefined);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  active() {
    this.refresh();
    this.isActive.set(true);
  }

  dimiss() {
    this.isActive.set(false);
  }

  toggle(id: number | undefined) {
    this.control?.setValue(id ?? null);
    this.isActive.set(false);
  }

  search(event: any) {
    this.searchOption.set(event.detail.value);
    this.refresh();
  }

  refresh(event?: any) {
    this.options.reset();
    this.options.addItem(
      "-",
      ""
    );
    this.load(event);
  }

  load(event?: any) {
    if (this.options.isComplete() || this.options.isLoading() === true) {
      event?.target.complete();
    } else {
      this.options.isLoading.set(true);

      this.unitService.list(
        this.options.pageIndex,
        this.options.pageSize,
        this.searchOption()
      ).subscribe({
        next: (response) => {
          for (const unit of response.data) {
            this.options.addItem(
              unit.name,
              unit.description,
              undefined,
              undefined,
              unit.id
            );
          }

          const { index, total } = response.pagination;
          this.options.isComplete.set(index === total);
          this.options.pageIndex++;
          event?.target.complete();
          this.options.isLoading.set(false);
        },
        error: (error) => {
          this.options.errorMessage.set(error.message);

          event?.target.complete();
          this.options.isLoading.set(false);
        },
      });
    }
  }
}
