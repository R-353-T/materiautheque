import { Component, inject, signal, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { ScrollTopButtonComponent } from "src/app/v1/component/atom/scroll-top-button/scroll-top-button.component";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { ImageService } from "src/app/v1/service/api/image.service";
import { PermissionService } from "src/app/v1/service/permission.service";
import { ListComponent } from "../../../component/organism/list/list.component";
import { List, ListItemOptions } from "src/app/v1/interface/app.interface";
import { SearchBarValue } from "src/app/v1/interface/ionic.interface";
import { ListItemComponent } from "src/app/v1/component/organism/list-item/list-item.component";
import {
  IonButton,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
} from "@ionic/angular/standalone";

@Component({
  selector: "app-image-list",
  templateUrl: "./image-list.page.html",
  styleUrls: ["./image-list.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonButton,
    IonSearchbar,
    CommonModule,
    FormsModule,
    HeaderComponent,
    ScrollTopButtonComponent,
    ListComponent,
    ListItemComponent,
  ],
})
export class ImageListPage {
  @ViewChild(IonContent, { static: true })
  content: IonContent | undefined;

  readonly list = new List();
  readonly searchOption = signal<SearchBarValue>(null);
  readonly navigationService = inject(NavigationService);
  readonly permissionService = inject(PermissionService);
  private readonly imageService = inject(ImageService);

  ionViewWillEnter() {
    this.list.options.infinite.set(true);
    this.refresh();
  }

  onSearch(event: any) {
    this.searchOption.set(event.detail.value);
    this.refresh();
  }

  refresh(event?: any) {
    if (this.list.options.loading() === true) {
      event?.target.complete();
    } else {
      this.list.refresh();
      this.loadNext(event);
    }
  }

  loadNext(event?: any) {
    this.list.options.loading.set(true);

    this.imageService
      .list(this.list.index(), this.searchOption())
      .subscribe({
        next: (response) => {
          for (const image of response.data) {
            const item = new ListItemOptions();
            item.id = image.id;
            item.label = image.name;
            item.mode.set("redirection");
            item.redirection = ["/image", image.id];
            this.list.add(item);
          }

          const { index, total } = response.pagination;
          this.list.next(index + 1, index === total);
          event?.target.complete();
        },
        error: (error) => {
          this.list.options.errors.set([error.message]);
          this.list.options.loading.set(false);
          event?.target.complete();
        }
      });
  }
}
