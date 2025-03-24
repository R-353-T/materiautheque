import { CommonModule } from "@angular/common";
import { FilterType, List, ListItemOptions } from "src/app/v1/interface/app.interface";
import { TypeService } from "src/app/v1/service/api/type.service";
import { FilterComponent } from "../../atom/filter/filter.component";
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
} from "@angular/core";
import { Subscription } from "rxjs";

@Component({
  selector: "app-type-filter",
  templateUrl: "./type-filter.component.html",
  styleUrls: ["./type-filter.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    FilterComponent
]
})
export class TypeFilterComponent implements OnInit {
  @Input()
  label?: string = "Type";

  @Input()
  required: boolean = false;

  @Input()
  multiple: boolean = false;

  @Input()
  selection = signal<FilterType>(null);

  @Output()
  change = new EventEmitter<FilterType>();

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
            item.label = "Tous";
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
