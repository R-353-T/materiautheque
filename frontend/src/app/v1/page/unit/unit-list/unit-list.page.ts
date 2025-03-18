import {
  Component,
  inject,
  signal,
  ViewChild,
  WritableSignal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { InfiniteScrollComponent } from "src/app/v1/component/organism/infinite-scroll/infinite-scroll.component";
import { InfiniteScrollOptions } from "src/app/v1/component/organism/infinite-scroll/infinite-scroll-options";
import { UnitService } from "src/app/v1/service/api/unit.service";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { PermissionService } from "src/app/v1/service/permission.service";
import {
  IonButton,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
} from "@ionic/angular/standalone";
import { ScrollTopButtonComponent } from "src/app/v1/component/atom/scroll-top-button/scroll-top-button.component";

@Component({
  selector: "app-unit-list",
  templateUrl: "./unit-list.page.html",
  styleUrls: ["./unit-list.page.scss"],
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
    InfiniteScrollComponent,
    ScrollTopButtonComponent,
  ],
})
export class UnitListPage {
  @ViewChild(IonContent, { static: true })
  content: IonContent | undefined;

  readonly options = new InfiniteScrollOptions();
  readonly searchOption: WritableSignal<string | undefined | null> = signal(
    null,
  );

  readonly navigationService = inject(NavigationService);
  readonly permissionService = inject(PermissionService);

  private readonly unitService = inject(UnitService);

  ionViewWillEnter() {
    this.refresh();
  }

  search(event: any) {
    this.searchOption.set(event.detail.value);
    this.refresh();
  }

  refresh(event?: any) {
    this.options.reset();
    this.load(event);
  }

  load(event?: any) {
    if (this.options.isComplete() || this.options.isLoading() === true) {
      event?.target.complete();
    } else {
      this.options.isLoading.set(true);

      this.unitService.list(
        this.options.pageIndex,
        this.options.pageSize,
        this.searchOption(),
      )
        .subscribe({
          next: (response) => {
            for (const unit of response.data) {
              this.options.addItem(
                unit.name,
                unit.description,
                undefined,
                ["/unit", unit.id],
              );
            }

            const { index, total } = response.pagination;
            this.options.isComplete.set(index === total);
            this.options.pageIndex++;
            event?.target.complete();
            this.options.isLoading.set(false);
          },
          error: (error) => {
            this.options.errorMessage.set(error.message);
            event?.target.complete();
            this.options.isLoading.set(false);
          },
        });
    }
  }
}
