import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { routes } from 'src/app/app.routes';
import { UserService } from 'src/app/v1/service/user/user.service';
import {
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
  IonLabel
} from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment';
import { UserRole } from 'src/app/v1/enum/UserRole';
import { PermissionService } from 'src/app/v1/service/permission.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
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
    RouterModule
  ]
})
export class MainMenuComponent implements OnInit, OnDestroy {

  public routes: Routes = routes;
  public userService = inject(UserService);

  private validRoutes = [
    ['home', UserRole.SUBSCRIBER],
    ['r/form/material-list', environment.permission.form.list],
    ['r/form/test-list', environment.permission.form.list],
    ['template-list', environment.permission.template.list],
    ['enumerator-list', environment.permission.enumerator.list],
    ['unit-list', environment.permission.unit.list],
    ['image-list', environment.permission.image.list]
  ];

  private readonly permissionService = inject(PermissionService);
  private subscription ?: Subscription;

  ngOnInit() {
    this.subscription = this.userService.user$.subscribe({
      next: () => {
        this.routes = this.validRoutes
          .map(route => routes.find(r => r.path === route[0] && this.permissionService.hasPermission(route[1] as UserRole)))
          .filter(r => r !== undefined);
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
