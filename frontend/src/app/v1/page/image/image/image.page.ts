import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonContent } from "@ionic/angular/standalone";
import { map, Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { HeaderComponent } from "../../../component/organism/header/header.component";
import { IImage } from "src/app/v1/interface/image.interface";
import { PermissionService } from "src/app/v1/service/permission.service";
import { EditTitleComponent } from "../../../component/title/edit-title/edit-title.component";

@Component({
  selector: "app-image",
  templateUrl: "./image.page.html",
  styleUrls: ["./image.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    HeaderComponent,
    EditTitleComponent
],
})
export class ImagePage {
  image$?: Observable<IImage | undefined>;
  readonly navigationService = inject(NavigationService);
  readonly permissionService = inject(PermissionService);
  private readonly route = inject(ActivatedRoute);

  ionViewWillEnter() {
    this.navigationService.backTo = this.navigationService.lastPage;
    this.image$ = this.route.data
      .pipe(map((data) => data["image"] as IImage | undefined));
  }
}
