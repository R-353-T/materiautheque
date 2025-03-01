import { Component, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { map, Observable, take } from "rxjs";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { ActivatedRoute } from "@angular/router";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { TypeService } from "src/app/v1/service/api/type.service";
import { EnumeratorService } from "src/app/v1/service/api/enumerator.service";
import { UnitService } from "src/app/v1/service/api/unit.service";
import { IUnit } from "src/app/v1/interface/unit.interface";
import { IEnumerator } from "src/app/v1/interface/enumerator.interface";
import { IField } from "src/app/v1/interface/field.interface";
import { IGroup } from "src/app/v1/interface/group.interface";
import { IType } from "src/app/v1/interface/type.interface";
import {
  IonBadge,
  IonButton,
  IonContent,
  IonText,
} from "@ionic/angular/standalone";

@Component({
  selector: "app-field",
  templateUrl: "./field.page.html",
  styleUrls: ["./field.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonText,
    IonBadge,
    CommonModule,
    FormsModule,
    HeaderComponent,
  ],
})
export class FieldPage {
  field$?: Observable<IField>;

  readonly group = signal<IGroup | undefined>(undefined);
  readonly type = signal<IType | undefined>(undefined);
  readonly enumerator = signal<IEnumerator | undefined>(undefined);
  readonly unit = signal<IUnit | undefined>(undefined);

  readonly navigationService = inject(NavigationService);

  private readonly route = inject(ActivatedRoute);
  private readonly typeService = inject(TypeService);
  private readonly enumeratorService = inject(EnumeratorService);
  private readonly unitService = inject(UnitService);

  ionViewWillEnter() {
    this.field$ = this.route.data.pipe(map((data) => data["field"] as IField));
    this.navigationService.backTo = this.navigationService.lastPage;
    this.type.set(undefined);
    this.enumerator.set(undefined);
    this.unit.set(undefined);
    this.group.set(undefined);

    this.route.data.pipe(take(1))
      .subscribe({
        next: (data) => {
          const field = data["field"] as IField;
          this.group.set(data["group"] as IGroup);

          if (field.typeId !== null) {
            this.typeService.get(field.typeId).subscribe({
              next: (type) => this.type.set(type),
            });
          }

          if (field.enumeratorId !== null) {
            this.enumeratorService.get(field.enumeratorId).subscribe({
              next: (enumerator) => {
                this.enumerator.set(enumerator);
              },
            });
          }

          if (field.unitId !== null) {
            this.unitService.get(field.unitId).subscribe({
              next: (unit) => {
                this.unit.set(unit);
              },
            });
          }
        },
      });
  }
}
