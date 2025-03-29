import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { List, ListItemOptions, SelectType } from 'src/app/v1/interface/app.interface';
import { EnumeratorService } from 'src/app/v1/service/api/enumerator.service';
import { SelectComponent } from "../../atom/select/select.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-enumerator-select',
  templateUrl: './enumerator-select.component.html',
  styleUrls: ['./enumerator-select.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SelectComponent
  ]
})
export class EnumeratorSelectComponent implements OnInit {
  @Input()
  label?: string;

  @Input()
  required: boolean = false;

  @Input()
  multiple: boolean = false;

  @Input()
  control = new FormControl();

  @Output()
  change = new EventEmitter<SelectType>();

  readonly list = new List();
  private readonly enumeratorService = inject(EnumeratorService);

  ngOnInit(): void {
    this.list.options.infinite.set(true);
    this.refresh();
  }

  private refresh(event?: any) {
    if (this.list.options.loading() === true) {
      event?.target.complete();
    } else {
      this.list.refresh();
      this.loadNext(event);
    }
  }

  loadNext(event?: any) {
    this.list.options.loading.set(true);

    this.enumeratorService
      .list(this.list.index())
      .subscribe({
        next: (response) => {
          if(this.list.index() === 1 && this.required === false) {
            const none = new ListItemOptions();
            none.label = "";
            none.mode.set("radio");
            this.list.add(none);
          }

          for (const enumerator of response.data) {
            const item = new ListItemOptions();
            item.id = enumerator.id;
            item.label = enumerator.name;
            item.description = enumerator.description;
            item.mode.set("radio");
            this.list.add(item);
          }
          
          const { index, total } = response.pagination;
          this.list.next(index + 1, index === total);
          event?.target.complete();
        },
        error: (error) => {
          this.list.options.errors.set([error.message]);
          this.list.options.loading.set(false);
          event?.target.complete();
        },
      });
  }
}
