import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { HeaderService } from "src/app/services/header.service";
import {
  IonHeader,
  IonProgressBar,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton
} from "@ionic/angular/standalone";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonProgressBar,
    IonButtons,
    IonMenuButton,
    CommonModule,
  ],
  standalone: true,
})
export class HeaderComponent {
  readonly headerService = inject(HeaderService);
  readonly titleService = inject(Title);

  readonly loading = this.headerService.loading;
}
