import { CommonModule } from "@angular/common";
import { ListComponent } from "../../organism/list/list.component";
import { ListItemComponent } from "../../organism/list-item/list-item.component";
import {
  FilterType,
  List,
  ListItemOptions,
} from "src/app/v1/interface/app.interface";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/angular/standalone";
import {
  Component,
  computed,
  effect,
  EventEmitter,
  Input,
  Output,
  signal,
} from "@angular/core";

@Component({
  selector: "app-filter",
  templateUrl: "./filter.component.html",
  styleUrls: ["./filter.component.scss"],
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
    CommonModule,
    ListComponent,
    ListItemComponent
],
})
export class FilterComponent {
  @Input()
  label?: string;

  @Input()
  selection = signal<FilterType>(null);

  @Input()
  required: boolean = false;

  @Input()
  multiple: boolean = false;

  @Input()
  list = new List();

  @Output()
  change = new EventEmitter<FilterType>();

  @Output()
  loadMore = new EventEmitter<any>();

  preview = computed(() => {
    const selection = this.selection();

    if(selection instanceof Array) {
      return selection.length.toString();
    } else if(typeof selection === "number") {
      return selection.toString(); 
    } else {
      return selection?.label || 'missing value';
    }
  });

  readonly focus = signal<boolean>(false);

  constructor() {
    effect(() => {
      const items = this.list.items();
      const type = this.selection();

      if(typeof type === "number" || type === null) {
        for(const i of items) {
          if(i.id === type) {
            i.selected.set(true);
            this.selection.set(i);
            this.onSelect(i);
          } 
        }
      }
    });
  }

  onSelect(item: ListItemOptions) {
    if(this.multiple === false) {
      for(const i of this.list.items()) {
        i.selected.set(false);
      }

      item.selected.set(true);
      this.selection.set(item);
      this.focus.set(false);
    } else {
      const selected = this.list
        .items()
        .filter(i => i.selected());
      this.selection.set(selected);
    }

    this.change.emit(this.selection());
  }
}
