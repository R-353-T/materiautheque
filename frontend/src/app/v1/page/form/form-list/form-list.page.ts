import {
  Component,
  inject,
  signal,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { InfiniteScrollComponent } from "src/app/v1/component/organism/infinite-scroll/infinite-scroll.component";
import { ScrollTopButtonComponent } from "src/app/v1/component/atom/scroll-top-button/scroll-top-button.component";
import { InfiniteScrollOptions } from 'src/app/v1/interface/app.interface';
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { FormService } from "src/app/v1/service/api/form.service";
import { ActivatedRoute } from "@angular/router";
import { take } from "rxjs";
import {
  IonButton,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
} from "@ionic/angular/standalone";
import { ITemplate } from "src/app/v1/interface/template.interface";
import { PermissionService } from "src/app/v1/service/permission.service";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";

@Component({
  selector: "app-form-list",
  templateUrl: "./form-list.page.html",
  styleUrls: ["./form-list.page.scss"],
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
export class FormListPage {
  @ViewChild(IonContent, { static: true })
  content: IonContent | undefined;

  readonly options = new InfiniteScrollOptions();
  readonly template = signal<ITemplate | undefined>(undefined);
  readonly searchOption = signal<string | undefined | null>(null);
  readonly navigationService = inject(NavigationService);
  readonly permissionService = inject(PermissionService);

  private readonly formService = inject(FormService);
  private readonly route = inject(ActivatedRoute);

  ionViewWillEnter() {
    this.route.data.pipe(take(1))
      .subscribe({
        next: (data) => this.template.set(data["template"] as ITemplate),
      });
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

      this.formService.list(
        this.template()!.id,
        this.options.pageIndex,
        this.options.pageSize,
        this.searchOption()
      )
        .subscribe({
          next: (response) => {
            for (const form of response.data) {
              this.options.addItem(
                form.name,
                undefined,
                undefined,
                ["/form", form.id],
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
