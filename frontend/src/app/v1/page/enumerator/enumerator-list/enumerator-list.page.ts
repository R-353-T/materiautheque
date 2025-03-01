import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormsModule } from "@angular/forms";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { InfiniteScrollOptions } from "src/app/v1/component/organism/infinite-scroll/infinite-scroll-options";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { EnumeratorService } from "src/app/v1/service/api/enumerator.service";
import { InfiniteScrollComponent } from "src/app/v1/component/organism/infinite-scroll/infinite-scroll.component";
import { ScrollTopButtonComponent } from "src/app/v1/component/atom/scroll-top-button/scroll-top-button.component";
import { PermissionService } from "src/app/v1/service/permission.service";
import {
  IonButton,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
} from "@ionic/angular/standalone";
import { FilterTypeComponent } from "../../../component/filter/filter-type/filter-type.component";
import { Subscription } from "rxjs";

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
    InfiniteScrollComponent,
    ScrollTopButtonComponent,
    FilterTypeComponent,
  ],
})
export class EnumeratorListPage implements OnInit, OnDestroy {
  @ViewChild(IonContent, { static: true })
  content: IonContent | undefined;

  readonly options = new InfiniteScrollOptions();
  readonly typeIdOption = new FormControl<number | undefined>(undefined);
  readonly searchOption: WritableSignal<string | undefined | null> = signal(
    null,
  );

  readonly navigationService = inject(NavigationService);
  readonly permissionService = inject(PermissionService);

  private readonly enumeratorService = inject(EnumeratorService);

  private typeFilterSubscription?: Subscription;

  ngOnInit(): void {
    this.typeFilterSubscription = this.typeIdOption.valueChanges.subscribe(
      () => this.refresh()
    )
  }

  ngOnDestroy(): void {
    this.typeFilterSubscription?.unsubscribe();
  }

  ionViewWillEnter = () => this.refresh();

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

      this.enumeratorService.list(
        this.options.pageIndex,
        this.options.pageSize,
        this.searchOption(),
        this.typeIdOption.value,
      ).subscribe({
        next: (response) => {
          for (const enumerator of response.data) {
            this.options.addItem(
              enumerator.name,
              enumerator.description,
              undefined,
              ["/enumerator", enumerator.id],
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
