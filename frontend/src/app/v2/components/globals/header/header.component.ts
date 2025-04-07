import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, IonButtons, IonHeader, IonIcon, IonMenuButton, IonProgressBar, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/v2/services/auth/auth.service';
import { HeaderService } from 'src/app/v2/services/header/header.service';
import { NavigatorService } from 'src/app/v2/services/navigator/navigator.service';

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonMenuButton,
    IonProgressBar,
    CommonModule,
    CommonModule,
    RouterLink
  ]
})
export class HeaderComponent {
  readonly headerService = inject(HeaderService);
  readonly navigatorService = inject(NavigatorService);
  readonly authService = inject(AuthService);
  
  readonly titleSignal = this.headerService.titleSignal;
  readonly isLoadingSignal = this.headerService.isLoadingSignal;
  readonly isAuthenticatedSignal = this.authService.isAuthenticatedSignal;
  readonly lastRoute = this.navigatorService.lastRoute;
}
