import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormsModule } from "@angular/forms";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { ActivatedRoute } from "@angular/router";
import { Subscription, take } from "rxjs";
import { InfiniteScrollComponent } from "src/app/v1/component/organism/infinite-scroll/infinite-scroll.component";
import { InfiniteScrollOptions } from 'src/app/v1/interface/app.interface';
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { ITemplate } from "src/app/v1/interface/template.interface";
import { IGroup } from "src/app/v1/interface/group.interface";
import { IonButton, IonContent, IonText } from "@ionic/angular/standalone";
import { SelectGroupComponent } from "../../../../component/form/select-group/select-group.component";

@Component({
  selector: "app-group-list",
  templateUrl: "./group-list.page.html",
  styleUrls: ["./group-list.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonText,
    CommonModule,
    FormsModule,
    HeaderComponent,
    InfiniteScrollComponent,
    SelectGroupComponent,
  ],
})
export class GroupListPage implements OnInit, OnDestroy {
  readonly name = computed(() =>
    this.group()?.name ?? this.template()?.name ?? ""
  );

  readonly template = signal<ITemplate | undefined>(undefined);
  readonly group = signal<IGroup | undefined>(undefined);
  readonly groupIdSelector = new FormControl<number | null>(null);

  readonly fieldOptions = new InfiniteScrollOptions();
  readonly groupOptions = new InfiniteScrollOptions();

  readonly navigationService = inject(NavigationService);

  private readonly route = inject(ActivatedRoute);

  private groupIdSubscription?: Subscription;

  ngOnInit(): void {
    this.groupIdSubscription = this.groupIdSelector.valueChanges.subscribe(
      (groupId) => {
        if (this.groupOptions.isComplete()) {
          this.navigationService.goToTemplateGroupList(
            this.template()!.id,
            groupId ?? undefined,
          );
        }
      },
    );
  }

  ngOnDestroy(): void {
    this.groupIdSubscription?.unsubscribe();
  }

  ionViewWillEnter() {
    this.groupOptions.reset();
    this.fieldOptions.reset();

    this.groupOptions.isLoading.set(true);
    this.fieldOptions.isLoading.set(true);

    this.route.data.pipe(take(1))
      .subscribe({
        next: (data) => {
          this.groupOptions.isLoading.set(false);
          this.fieldOptions.isLoading.set(false);

          this.template.set(data["template"]);
          this.group.set(data["group"]);
          this.groupIdSelector.setValue(this.group()?.id ?? null);

          const group = this.group();
          if (group && group.groupList) {
            this.loadGroups(group.groupList);
            this.loadFields(group);
            this.navigationService.backTo = this.navigationService
              .goToTemplateGroupList.bind(
                this.navigationService,
                group.templateId,
                group.parentId ?? undefined,
              );
          } else {
            this.loadGroups(this.template()!.groupList!);
            this.navigationService.backTo = undefined;
          }

          this.groupOptions.isComplete.set(true);
          this.fieldOptions.isComplete.set(true);
        },
      });
  }

  private loadGroups(groupList: IGroup[]) {
    for (const group of groupList) {
      this.groupOptions.addItem(
        group.name,
        group.description,
        undefined,
        ["/template/group-list/", group.templateId, group.id],
      );
    }
  }

  private loadFields(group: IGroup) {
    for (const field of group.fieldList) {
      this.fieldOptions.addItem(
        field.name,
        field.description,
        undefined,
        ["/template/field/", group.id, field.id],
      );
    }
  }
}
