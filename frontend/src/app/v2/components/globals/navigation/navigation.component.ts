import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { RouterLink, Routes } from "@angular/router";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonToolbar,
} from "@ionic/angular/standalone";
import { routes } from "src/app/app.routes";
import { UserRole } from "src/app/v2/core/enums/UserRoles";
import { AuthService } from "src/app/v2/services/auth/auth.service";
import { PermissionService } from "src/app/v2/services/permission/permission.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "navigation-component",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.scss"],
  standalone: true,
  imports: [
    IonMenu,
    IonHeader,
    IonButtons,
    IonMenuToggle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    CommonModule,
    RouterLink,
  ],
})
export class NavigationComponent implements OnInit {
  routes: Routes = routes;
  readonly authService = inject(AuthService);
  private readonly permissionService = inject(PermissionService);

  private _routes: [string, UserRole][] = [
    ["home", "subscriber"],
    ["r/form/material-list", environment.permission.form.list],
    ["r/form/test-list", environment.permission.form.list],
    ["template-list", environment.permission.template.list],
    ["enumerator-list", environment.permission.enumerator.list],
    ["unit-list", environment.permission.unit.list],
    ["image-list", environment.permission.image.list],
  ];

  ngOnInit() {
    this.routes = this._routes
      .map((route) =>
        routes.find((r) =>
          r.path === route[0] &&
          this.permissionService.isAllow(route[1])
        )
      )
      .filter((r) => r !== undefined);
  }
}
