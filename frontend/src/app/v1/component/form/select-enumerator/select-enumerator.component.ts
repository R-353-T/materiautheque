import { Component, inject, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EnumeratorService } from 'src/app/v1/service/api/enumerator.service';
import { EMPTY_FORM } from 'src/app/v1/form/empty.form';
import { IEnumerator } from 'src/app/v1/interface/enumerator.interface';
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
import { CommonModule } from '@angular/common';
import { InfiniteScrollComponent } from "../../organism/infinite-scroll/infinite-scroll.component";
import { InfiniteScrollOptions } from '../../organism/infinite-scroll/infinite-scroll-options';

@Component({
  selector: 'app-select-enumerator',
  templateUrl: './select-enumerator.component.html',
  styleUrls: ['./select-enumerator.component.scss'],
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
export class SelectEnumeratorComponent implements OnInit, OnDestroy {
  @Input()
  control?: FormControl;

  @Input()
  label?: string;

  @Input()
  icon: string = "chevron-expand";

  readonly isActive = signal<boolean>(false);
  readonly selected = signal<IEnumerator | undefined>(undefined);
  readonly enumeratorService = inject(EnumeratorService);
  readonly form = EMPTY_FORM;
  readonly options = new InfiniteScrollOptions();
  readonly searchOption = signal<string | undefined | null>(null);
  private subscription?: Subscription;

  ngOnInit(): void {
    if(this.control?.value && this.control?.enabled) {
      this.enumeratorService.get(this.control.value).subscribe((enumerator) => {
        console.log("First Update enumerator", enumerator);
        this.selected.set(enumerator);
      });
    }

    this.subscription = this.control?.valueChanges.subscribe((id) => {
      if (id && this.control?.enabled) {
        this.enumeratorService.get(id).subscribe((enumerator) => {
          console.log("Updated enumerator", enumerator);

          this.selected.set(enumerator);
        });
      }

      if(id === null && this.control?.enabled) {
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

      this.enumeratorService.list(
        this.options.pageIndex,
        this.options.pageSize,
        this.searchOption()
      ).subscribe({
        next: (response) => {
          for (const enumerator of response.data) {
            this.options.addItem(
              enumerator.name,
              enumerator.description,
              undefined,
              undefined,
              enumerator.id
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
