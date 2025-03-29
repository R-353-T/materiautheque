import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormsModule } from "@angular/forms";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { ActivatedRoute, Router } from "@angular/router";
import { take } from "rxjs";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { ITemplate } from "src/app/v1/interface/template.interface";
import { IGroup } from "src/app/v1/interface/group.interface";
import { IonButton, IonContent } from "@ionic/angular/standalone";
import { InputComponent } from "src/app/v1/component/atom/input/input.component";
import { EditTitleComponent } from "../../../../component/title/edit-title/edit-title.component";
import { FilterType, List, ListItemOptions } from "src/app/v1/interface/app.interface";
import { ListComponent } from "../../../../component/organism/list/list.component";
import { ListItemComponent } from "src/app/v1/component/organism/list-item/list-item.component";
import { GroupFilterComponent } from "../../../../component/group/group-filter/group-filter.component";
import { TemplateService } from "src/app/v1/service/api/template.service";

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
    HeaderComponent,
    EditTitleComponent,
    ListComponent,
    ListItemComponent,
    GroupFilterComponent
],
})
export class GroupListPage {
  readonly fieldList = new List();
  readonly groupList = new List();

  readonly template = signal<ITemplate | undefined>(undefined);
  readonly group = signal<IGroup | undefined>(undefined);
  readonly title = signal<string>("");
  readonly fastTravelSelection = signal<FilterType>(null);

  readonly descriptionControl = new FormControl<string | null>(null);
  readonly navigationService = inject(NavigationService);
  private readonly templateService = inject(TemplateService);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ionViewWillEnter() {
    this.setBackTo(undefined);
    this.resetPage();

    this.route.data
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          const group = data["group"] as IGroup | undefined;
          let template = data["template"] as ITemplate;

          if (group) {
            this.group.set(group);
            this.fastTravelSelection.set(group.id);
            this.loadGroups(group);
            this.loadFields(group);
            this.descriptionControl.setValue(group.description);
          } else {
            this.loadGroups(template);
            this.descriptionControl.setValue(null);
            this.fastTravelSelection.set(null);
          }

          this.template.set(template);
          this.setBackTo(group);
          this.title.set(group ? group.name : template.name);

          console.log(this.template());
        },
      });
  }

  goToGroup(selected: FilterType) {
    if(selected instanceof ListItemOptions) {
      this.router.navigate(selected.redirection);
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

  private resetPage() {
    this.descriptionControl.setValue(null);
    this.template.set(undefined);
    this.fieldList.items.set([]);
    this.groupList.items.set([]);
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

  private loadGroups(data: IGroup | ITemplate) {
    const groupList = data.groupList;
    if(groupList !== undefined) {
      for (const group of groupList) {
        const item = new ListItemOptions();
        item.id = group.id;
        item.label = group.name;
        item.description = group.description;
        item.mode.set("redirection");
        item.redirection = ["/template/group-list/", group.templateId , group.id];
        this.groupList.add(item);
      }
    }
  }

  private loadFields(group: IGroup) {
    const fieldOptions = this.fieldList;
    if(group.fieldList !== undefined) {
      for (const field of group.fieldList) {
        const item = new ListItemOptions();
        item.id = field.id;
        item.label = field.name;
        item.description = field.description;
        item.mode.set("redirection");
        item.redirection = ["/template/field/", group.id, field.id];
        fieldOptions.add(item);
      }
    }
  }
}
