import { Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";

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
import { filter, Subscription } from "rxjs";
import { routes } from "src/app/app.routes";
import { ApiAuthenticationService } from "src/app/services/api.authentication.service";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
  selector: "app-main-navigation",
  templateUrl: "./main-navigation.component.html",
  styleUrls: ["./main-navigation.component.scss"],
  imports: [
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
  ],
  standalone: true,
})
export class MainNavigationComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly routes = routes;

  routerNavigationSubscription?: Subscription;
  readonly navigationService = inject(NavigationService);
  readonly authService = inject(ApiAuthenticationService);
  readonly items = signal<{ label: string, allowed: boolean; path: string|any[]; icon: string|undefined }[]>(
    [],
  );

  ngOnInit(): void {
    this.refresh();

    this.routerNavigationSubscription = this.router.events
      .pipe(filter((e) => e instanceof NavigationStart))
      .subscribe(() => this.refresh());
  }

  refresh() {
    if (this.authService.user() !== null) {
      const items = this.routes
        .filter((route) =>
          route.data &&
          "navigation" in route.data &&
          route.data["navigation"].display === true &&
          route.data["navigation"].label != null &&
          this.authService.user() !== null
        )
        .map((route) => {
          const data = route.data!["navigation"];
          
          let allowed = true;

          if('allowedRoles' in route.data!["navigation"]) {
            allowed = route.data!["navigation"].allowedRoles.includes(this.authService.user()?.role);
          }

          return {
            label: data.label,
            allowed,
            path: '/' + route.path,
            icon: data.icon ? String(data.icon) : undefined,
          };
        });

        this.items.set(items);
    }
  }

  ngOnDestroy(): void {
    this.routerNavigationSubscription?.unsubscribe();
  }

  logout() {
    this.authService.logout();
    this.navigationService.goToLogin();
  }
}
