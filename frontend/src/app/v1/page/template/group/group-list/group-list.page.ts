import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormsModule } from "@angular/forms";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { ActivatedRoute } from "@angular/router";
import { take } from "rxjs";
import { InfiniteScrollComponent } from "src/app/v1/component/organism/infinite-scroll/infinite-scroll.component";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { ITemplate } from "src/app/v1/interface/template.interface";
import { IGroup } from "src/app/v1/interface/group.interface";
import { IonButton, IonContent, IonText } from "@ionic/angular/standalone";
import { InputComponent } from "src/app/v1/component/form/input/input.component";
import { SelectComponent } from "src/app/v1/component/atom/select/select.component";
import { TemplateService } from "src/app/v1/service/api/template.service";
import {
  InfiniteScrollOptions,
} from "src/app/v1/interface/app.interface";

@Component({
  selector: "app-group-list",
  templateUrl: "./group-list.page.html",
  styleUrls: ["./group-list.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    CommonModule,
    FormsModule,
    InputComponent,
    SelectComponent,
    HeaderComponent,
    InfiniteScrollComponent,
  ],
})
export class GroupListPage {
  readonly fieldOptions = new InfiniteScrollOptions();
  readonly groupOptions = new InfiniteScrollOptions();

  readonly template = signal<ITemplate | undefined>(undefined);
  readonly group = signal<IGroup | undefined>(undefined);
  readonly title = signal<string>("");

  readonly descriptionControl = new FormControl<string | null>(null);
  readonly navigationService = inject(NavigationService);
  // readonly groupSelectOptions = new SelectOptions();

  private readonly route = inject(ActivatedRoute);
  private readonly templateService = inject(TemplateService);

  ionViewWillEnter() {
    this.setBackTo(undefined);
    this.resetPage();

    this.route.data
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          const template = data["template"] as ITemplate;
          const group = data["group"] as IGroup | undefined;

          if (group) {
            this.group.set(group);
            // this.groupSelectOptions.control.setValue(group.id);
            this.loadGroups(group);
            this.loadFields(group);
            this.descriptionControl.setValue(group.description);
          } else {
            // this.groupSelectOptions.control.setValue(null);
            this.loadGroups(template);
            this.descriptionControl.setValue(null);
          }

          // this.groupSelectOptions.valueList = this.templateService.mapTemplateAsSelectValueList(template);
          this.template.set(template);
          this.setBackTo(group);
          this.title.set(group ? group.name : template.name);

          this.groupOptions.isComplete.set(true);
          this.fieldOptions.isComplete.set(true);
        },
      });
  }

  // moveToGroup(selected: ISelectValue | null) {
  //   if (selected === null || selected.depth === 0) {
  //     this.navigationService.goToTemplateGroupList(this.template()!.id);
  //   } else {
  //     this.navigationService.goToTemplateGroupList(
  //       this.template()!.id,
  //       selected.dto.id!,
  //     );
  //   }
  // }

  goToEditor() {
    const group = this.group();
    if (group) {
      this.navigationService.goToTemplateGroupEdit(group.templateId, group.id);
    } else {
      this.navigationService.goToTemplateEdit(this.template()!.id);
    }
  }

  private loadGroups(data: IGroup | ITemplate) {
    for (const group of data.groupList ?? []) {
      this.groupOptions.addItem(
        group.name,
        group.description,
        undefined,
        ["/template/group-list/", group.templateId, group.id],
      );
    }

    this.groupOptions.isLoading.set(false);
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

    this.fieldOptions.isLoading.set(false);
  }

  private resetPage() {
    // this.groupSelectOptions.required.set(true);
    this.descriptionControl.setValue(null);
    // this.groupSelectOptions.control.setValue(null);

    this.groupOptions.reset();
    this.fieldOptions.reset();

    this.groupOptions.isLoading.set(true);
    this.fieldOptions.isLoading.set(true);
  }

  private setBackTo(group: IGroup | undefined) {
    if (group) {
      this.navigationService.backTo = this.navigationService
        .goToTemplateGroupList.bind(
          this.navigationService,
          group.templateId,
          group.parentId ?? undefined,
        );
    } else {
      this.navigationService.backTo = this.navigationService.goToTemplateList
        .bind(this.navigationService);
    }
  }
}
