import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { List, ListItemOptions, SelectType } from 'src/app/v1/interface/app.interface';
import { FormService } from 'src/app/v1/service/api/form.service';
import { SelectComponent } from '../../atom/select/select.component';

@Component({
  selector: 'app-form-value-select',
  templateUrl: './form-value-select.component.html',
  styleUrls: ['./form-value-select.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SelectComponent
  ],
})
export class FormValueSelectComponent  implements OnInit {
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

  private readonly formService = inject(FormService);

  ngOnInit(): void {
    this.list.options.infinite.set(true);
    this.refresh();
  }

  private refresh(event?: any) {
    if (this.list.options.loading() === true) {
      event?.target.complete();
    } else {
      this.list.refresh();

      if(this.required === false) {
        const none = new ListItemOptions();
        none.label = "";
        none.mode.set("radio");
        this.list.add(none);
      }

      this.loadNext(event);
    }
  }

  loadNext(event?: any) {
    this.list.options.loading.set(true);

    this.formService
      .list(1, this.list.index(), undefined, 16)
      .subscribe({
        next: (response) => {
          for (const image of response.data) {
            const item = new ListItemOptions();
            item.id = image.id;
            item.label = image.name;
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
        }
      });
  }
}
