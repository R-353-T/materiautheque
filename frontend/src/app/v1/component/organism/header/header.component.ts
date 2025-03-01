import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderService } from 'src/app/v1/service/header/header.service';
import { UserService } from 'src/app/v1/service/user/user.service';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonMenuButton,
  IonProgressBar
} from "@ionic/angular/standalone";
import { NavigationService } from 'src/app/v1/service/navigation/navigation.service';

@Component({
  selector: 'app-header',
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
    CommonModule
  ]
})
export class HeaderComponent  implements OnInit {

  public readonly userService = inject(UserService);
  public readonly headerService = inject(HeaderService);
  public readonly navigationService = inject(NavigationService);
  public readonly titleService = inject(Title);

  ngOnInit() {}

}
