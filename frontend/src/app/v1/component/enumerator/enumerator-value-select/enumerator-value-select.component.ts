import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { List, ListItemOptions, SelectType } from 'src/app/v1/interface/app.interface';
import { SelectComponent } from '../../atom/select/select.component';
import { EnumeratorService } from 'src/app/v1/service/api/enumerator.service';

@Component({
  selector: 'app-enumerator-value-select',
  templateUrl: './enumerator-value-select.component.html',
  styleUrls: ['./enumerator-value-select.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SelectComponent
  ]
})
export class EnumeratorValueSelectComponent implements OnInit {
  @Input()
  id: number|null = null;

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
    this.refresh();
  }

  refresh() {
    this.list.options.loading.set(true);
    this.list.items.set([]);

    if(this.required === false) {
      const none = new ListItemOptions();
      none.label = "";
      none.mode.set("radio");
      this.list.add(none);
    }

    this.enumeratorService
      .get(this.id!)
      .subscribe({
        next: (response) => {
          for (const enumeratorValue of response.valueList) {
            const item = new ListItemOptions();
            item.id = enumeratorValue.id ?? null;
            item.label = enumeratorValue.value;
            item.mode.set("radio");
            this.list.add(item);
          }
          this.list.next(2, false);
          this.list.options.loading.set(false);
        },
        error: (error) => {
          this.list.options.errors.set([error.message]);
          this.list.options.loading.set(false);
        }
      });
  }
}
