import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { SelectComponent } from '../../atom/select/select.component';
import { FormControl } from '@angular/forms';
import { List, ListItemOptions, SelectType } from 'src/app/v1/interface/app.interface';
import { TypeService } from 'src/app/v1/service/api/type.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-type-select',
  templateUrl: './type-select.component.html',
  styleUrls: ['./type-select.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SelectComponent
  ]
})
export class TypeSelectComponent implements OnInit {
  @Input()
  label?: string;

  @Input()
  required: boolean = false;

  @Input()
  multiple: boolean = false;

  @Input()
  control = new FormControl<number|null>(null);

  @Output()
  change = new EventEmitter<SelectType>();

  readonly list = new List();
  private readonly typeService = inject(TypeService);

  ngOnInit(): void {
    this.list.options.loading.set(true);

    let subscription: Subscription|undefined;
    subscription = this.typeService.typeList$
      .subscribe({
        next: (types) => {
          if (types === undefined || types.length === 0) return;

          if(this.required === false) {
            const item = new ListItemOptions();
            item.id = null;
            item.label = "Aucun";
            item.mode.set(this.multiple ? "checkbox" : "radio");
            this.list.add(item);
          }

          for (const t of types) {
            const item = new ListItemOptions();
            item.id = t.id;
            item.label = t.name;
            item.mode.set(this.multiple ? "checkbox" : "radio");
            item.disabled.set(t.allowEnumeration === false);
            this.list.add(item);
          }

          this.list.options.loading.set(false);
          subscription?.unsubscribe();
        },
        error: (error) => {
          subscription?.unsubscribe();
        },
      });
  }
}
