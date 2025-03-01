import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
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
  IonText,
} from "@ionic/angular/standalone";

@Component({
  selector: "app-unit",
  templateUrl: "./unit.page.html",
  styleUrls: ["./unit.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    IonText,
    IonButton,
    IonBadge,
    CommonModule,
    FormsModule,
    HeaderComponent,
  ],
})
export class UnitPage {
  unit$?: Observable<IUnit>;
  readonly navigationService = inject(NavigationService);
  readonly permissionService = inject(PermissionService);

  private readonly route = inject(ActivatedRoute);

  ionViewWillEnter() {
    this.unit$ = this.route.data.pipe(map((data) => data["unit"] as IUnit));
    this.navigationService.backTo = this.navigationService.lastPage;
  }
}
