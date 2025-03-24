import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { EnumeratorService } from "src/app/v1/service/api/enumerator.service";
import { ScrollTopButtonComponent } from "src/app/v1/component/atom/scroll-top-button/scroll-top-button.component";
import { PermissionService } from "src/app/v1/service/permission.service";
import { TypeService } from "src/app/v1/service/api/type.service";
import { ListItemComponent } from "src/app/v1/component/organism/list-item/list-item.component";
import { ListComponent } from "src/app/v1/component/organism/list/list.component";
import { FilterType, List, ListItemOptions } from "src/app/v1/interface/app.interface";
import {
  IonButton,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
} from "@ionic/angular/standalone";
import {
  Component,
  computed,
  inject,
  signal,
  ViewChild,
} from "@angular/core";
import { TypeFilterComponent } from "../../../component/type/type-filter/type-filter.component";

@Component({
  selector: "app-enumerator-list",
  templateUrl: "./enumerator-list.page.html",
  styleUrls: ["./enumerator-list.page.scss"],
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
    TypeFilterComponent
],
})
export class EnumeratorListPage {
  @ViewChild(IonContent, { static: true })
  content: IonContent | undefined;

  readonly list = new List();
  readonly typeIdOption = signal<FilterType>(null);
  readonly searchOption = signal<string | null>(null);
  readonly navigationService = inject(NavigationService);
  readonly permissionService = inject(PermissionService);
  readonly typeService = inject(TypeService);
  private readonly enumeratorService = inject(EnumeratorService);

  typeId = computed(() => {
    const typeId = this.typeIdOption();
    return typeId === null 
      ? null
      : Array.isArray(typeId)
        ? typeId[0].id
        : typeof typeId === "number" ? typeId : typeId.id;
  });

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

    this.enumeratorService
      .list(this.list.index(), this.searchOption(), this.typeId())
      .subscribe({
        next: (response) => {
          for (const enumerator of response.data) {
            const item = new ListItemOptions();
            item.id = enumerator.id;
            item.label = enumerator.name;
            item.description = enumerator.description;
            item.mode.set("redirection");
            item.redirection = ["/enumerator", enumerator.id];
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
        },
      });
  }
}
