import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { map, Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { PermissionService } from "src/app/v1/service/permission.service";
import { IUnit } from "src/app/v1/interface/unit.interface";
import {
  IonBadge,
  IonButton,
  IonContent,
} from "@ionic/angular/standalone";
import { InputComponent } from "../../../component/form/input/input.component";
import { FORM__UNIT } from "src/app/v1/form/f.unit";

@Component({
  selector: "app-unit",
  templateUrl: "./unit.page.html",
  styleUrls: ["./unit.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonBadge,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    InputComponent
],
})
export class UnitPage {
  readonly baseForm = FORM__UNIT;

  unit$?: Observable<IUnit>;
  readonly navigationService = inject(NavigationService);
  readonly permissionService = inject(PermissionService);

  private readonly route = inject(ActivatedRoute);

  ionViewWillEnter() {
    this.baseForm.reset();
    this.navigationService.backTo = this.navigationService.lastPage;
    this.unit$ = this.route.data.pipe(map((data) => {
      const unit = data["unit"] as IUnit;
      this.baseForm.reset(unit);
      return unit;
    }));
  }
}
