import { CommonModule } from "@angular/common";
import { FormControl } from "@angular/forms";
import { Subscription } from "rxjs";
import { ListComponent } from "../../organism/list/list.component";
import { ListItemComponent } from "../../organism/list-item/list-item.component";
import {
  Component,
  effect,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from "@angular/core";
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
  List,
  ListItemOptions,
  SelectType,
} from "src/app/v1/interface/app.interface";

@Component({
  selector: "app-select",
  templateUrl: "./select.component.html",
  styleUrls: ["./select.component.scss"],
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
    CommonModule,
    ListComponent,
    ListItemComponent
  ],
})
export class SelectComponent implements OnInit, OnDestroy {
  @Input()
  label?: string;

  @Input()
  control = new FormControl<number|null>(null);

  @Input()
  required: boolean = false;

  @Input()
  multiple: boolean = false;

  @Input()
  list = new List();

  @Output()
  change = new EventEmitter<SelectType>();

  @Output()
  loadMore = new EventEmitter<any>();

  readonly focus = signal<boolean>(false);
  private subscription?: Subscription;

  preview: string = "...";

  ngOnInit(): void {
    this.updateItemsSelection(this.control.value);

    this.subscription = this.control.valueChanges.subscribe((value) => {
      this.updateItemsSelection(value);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onSelect(item: ListItemOptions) {
    if (this.multiple === false) {
      this.control.setValue(item.id);
    } else {
      const selected = this.list
        .items()
        .filter((i) => i.selected())
        .map((i) => i.id);
      this.control.setValue(selected[0]); // TODO: fix multiple
    }

    this.change.emit(this.control.value);
  }

  private updateItemsSelection(value: number|null) {
    if (this.multiple === false) {
      for (const i of this.list.items()) {
        i.selected.set(i.id === value);
      }
      this.focus.set(false);
    } else {
      const selected = this.list
        .items()
        .filter((i) => i.selected())
        .map((i) => i.id);
      this.control.setValue(selected[0]); // TODO: fix multiple
    }
    
    this.setPreview();
  }

  private setPreview() {
    const items = this.list.items();

    for (const i of items) {
      if (i.selected()) {
        this.preview = i.label ?? "...";
        return; // TODO: fix multiple
      }
    }
  }
}
