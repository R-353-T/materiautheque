
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ScrollTopButtonComponent } from "src/app/v1/component/atom/scroll-top-button/scroll-top-button.component";
import { List, ListItemOptions } from 'src/app/v1/interface/app.interface';
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { FormService } from "src/app/v1/service/api/form.service";
import { ActivatedRoute } from "@angular/router";
import { take } from "rxjs";
import { ITemplate } from "src/app/v1/interface/template.interface";
import { PermissionService } from "src/app/v1/service/permission.service";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import {
  Component,
  inject,
  signal,
  ViewChild,
} from "@angular/core";
import {
  IonButton,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
} from "@ionic/angular/standalone";
import { ListComponent } from "../../../component/organism/list/list.component";
import { ListItemComponent } from "../../../component/organism/list-item/list-item.component";
import { HeaderService } from "src/app/v1/service/header/header.service";

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
    ScrollTopButtonComponent,
    ListComponent,
    ListItemComponent
],
})
export class FormListPage {
  @ViewChild(IonContent, { static: true })
  content: IonContent | undefined;

  readonly list = new List();
  readonly template = signal<ITemplate | undefined>(undefined);
  readonly searchOption = signal<string | undefined | null>(null);
  readonly navigationService = inject(NavigationService);
  readonly permissionService = inject(PermissionService);
  private readonly headerService = inject(HeaderService);
  private readonly formService = inject(FormService);
  private readonly route = inject(ActivatedRoute);

  ionViewWillEnter() {
    this.template.set(undefined);
    this.list.items.set([]);

    this.route.data
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.template.set(data["template"] as ITemplate);
          this.refresh();
          this.headerService.title = this.template()?.name ?? "";
        },
      });
  }

  onSearch(event: any) {
    this.searchOption.set(event.detail.value);
    this.refresh();
  }

  refresh(event?: any) {
    if(this.list.options.loading() === true) {
      event?.target.complete();
    } else {
      this.list.refresh();
      this.loadNext(event);
    }
  }

  loadNext(event?: any) {
    this.list.options.loading.set(true);

    this.formService
    .list(this.template()!.id, this.list.index(), this.searchOption())
    .subscribe({
      next: (response) => {
        for (const form of response.data) {
          const item = new ListItemOptions();
          item.id = form.id;
          item.label = form.name;
          item.mode.set("redirection");
          item.redirection = ["/form", form.id];
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
