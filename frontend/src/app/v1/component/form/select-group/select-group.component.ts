import { CommonModule } from "@angular/common";
import {
  Component,
  Input,
  OnChanges,
  signal,
  SimpleChanges,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { EMPTY_FORM } from "src/app/v1/form/empty.form";
import { IGroup } from "src/app/v1/interface/group.interface";
import { ITemplate } from "src/app/v1/interface/template.interface";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/angular/standalone";

@Component({
  selector: "app-select-group",
  templateUrl: "./select-group.component.html",
  styleUrls: ["./select-group.component.scss"],
  standalone: true,
  imports: [
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonModal,
    IonTitle,
    IonToolbar,
    CommonModule,
  ],
})
export class SelectGroupComponent implements OnChanges {
  @Input()
  control?: FormControl;

  @Input()
  template?: ITemplate;

  @Input()
  label?: string;

  @Input()
  preventRecursionId?: number | null;

  @Input()
  required = false;

  @Input()
  icon: string = "chevron-expand";

  readonly isActive = signal<boolean>(false);
  readonly form = EMPTY_FORM;

  selected = signal<ITemplate | IGroup | undefined>(undefined);

  mapGroup: {
    id: number | undefined;
    name: string;
    disabled: boolean;
  }[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["template"]) {
      this.rmapTemplate();
    }
  }

  toggle(id: number | undefined) {
    this.control?.setValue(id);
    this.rmapTemplate();
    this.isActive.set(false);
  }

  isSelected(id: number | undefined) {
    return id === this.selected()?.id ||
      (id === undefined && this.control?.value === null);
  }

  rmapTemplate() {
    const output = [];
    if (this.template) {
      if (this.required === false) {
        output.push({
          id: undefined,
          name: this.template.name,
          disabled: false,
        });
      }

      if (this.control?.value === null) {
        this.selected.set(this.template);
      }

      this.template.groupList?.forEach((group) => {
        output.push(...this.rmapGroup(group));
      });
    }

    this.mapGroup = output;
  }

  rmapGroup(group: IGroup, depth = 1, disabled = false) {
    const output = [];

    if (group.id === this.preventRecursionId) {
      disabled = true;
    }

    output.push({
      id: group.id,
      name: "—".repeat(depth) + " " + group.name,
      disabled,
    });

    if (this.control?.value === group.id) {
      this.selected.set(group);
    }

    group.groupList?.forEach((group) => {
      output.push(...this.rmapGroup(group, depth + 1, disabled));
    });

    return output;
  }
}
