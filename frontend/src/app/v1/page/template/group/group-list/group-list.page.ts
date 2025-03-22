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
import { SelectComponent } from "src/app/v1/component/form/select/select.component";
import {
  InfiniteScrollOptions,
  ISelectValue,
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
  readonly groupIdControl = new FormControl<number | null>(null);
  readonly groupSelectValueList = signal<ISelectValue[]>([]);
  readonly navigationService = inject(NavigationService);

  private readonly route = inject(ActivatedRoute);

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
            this.groupIdControl.setValue(group.id);
            this.loadGroups(group);
            this.loadFields(group);
            this.descriptionControl.setValue(group.description);
          } else {
            this.groupIdControl.setValue(null);
            this.loadGroups(template);
            this.descriptionControl.setValue(null);
          }

          this.mapTemplate(template, undefined);
          this.template.set(template);
          this.setBackTo(group);
          this.title.set(group ? group.name : template.name);

          this.groupOptions.isComplete.set(true);
          this.fieldOptions.isComplete.set(true);
        },
      });
  }

  moveToGroup(selected: ISelectValue | null) {
    if (selected === null || selected.depth === 0) {
      this.navigationService.goToTemplateGroupList(this.template()!.id);
    } else {
      this.navigationService.goToTemplateGroupList(
        this.template()!.id,
        selected.dto.id!,
      );
    }
  }

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
    this.descriptionControl.setValue(null);
    this.groupIdControl.setValue(null);
    
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

  private mapTemplate(
    template: ITemplate,
    group: IGroup | undefined,
    depth: number = 0,
  ) {
    const output: ISelectValue[] = [];

    if (group === undefined) {
      output.push({
        depth: 0,
        dto: {
          id: null,
          value: template.name,
        },
        disabled: false,
      });

      template.groupList?.forEach((group) => {
        output.push(...this.mapTemplate(template, group, 1));
      });
    } else {
      output.push({
        depth: depth,
        dto: {
          id: group.id,
          value: group.name,
        },
        disabled: false,
      });

      group.groupList?.forEach((group) => {
        output.push(...this.mapTemplate(template, group, depth + 1));
      });
    }

    if (depth === 0) {
      this.groupSelectValueList.set(output);
    }

    return output;
  }
}
