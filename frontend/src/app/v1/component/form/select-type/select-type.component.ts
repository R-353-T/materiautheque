import { CommonModule } from "@angular/common";
import { Component, inject, Input, signal } from "@angular/core";
import { FormControl } from "@angular/forms";
import { TypeService } from "src/app/v1/service/api/type.service";
import { EMPTY_FORM } from "src/app/v1/form/empty.form";
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
  IonToolbar
} from "@ionic/angular/standalone";
import { IType } from "src/app/v1/interface/type.interface";

@Component({
  selector: "app-select-type",
  templateUrl: "./select-type.component.html",
  styleUrls: ["./select-type.component.scss"],
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
export class SelectTypeComponent {
  @Input()
  control?: FormControl;

  @Input()
  label?: string;

  @Input()
  required = false;

  @Input()
  only?: "enumerable" | "multiple";

  @Input()
  exclude?: number[];

  @Input()
  icon: string = "chevron-expand"; 

  readonly isActive = signal<boolean>(false);
  readonly typeService = inject(TypeService);
  readonly form = EMPTY_FORM;
  readonly selected = signal<IType | undefined>(undefined);

  selectType(id: number | undefined) {
    this.control?.setValue(id);
    this.isActive.set(false);
  }

  disabled(type: IType) {
    return this.only === "enumerable" && type.allowEnumeration === false
    || this.only === "multiple" && type.allowMultipleValues === false
    || this.exclude?.includes(type.id) === true;
  }
}
