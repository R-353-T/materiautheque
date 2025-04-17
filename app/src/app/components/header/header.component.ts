import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { HeaderService } from "src/app/services/header.service";
import {
  IonHeader,
  IonProgressBar,
  IonTitle,
  IonToolbar,
} from "@ionic/angular/standalone";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonProgressBar,
    CommonModule,
  ],
  standalone: true,
})
export class HeaderComponent {
  readonly headerService = inject(HeaderService);

  readonly loading = this.headerService.loading;
  readonly title = this.headerService.title.asReadonly();
}
