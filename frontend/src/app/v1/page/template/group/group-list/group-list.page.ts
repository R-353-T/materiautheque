import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormsModule } from "@angular/forms";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { ActivatedRoute } from "@angular/router";
import { take } from "rxjs";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { ITemplate } from "src/app/v1/interface/template.interface";
import { IGroup } from "src/app/v1/interface/group.interface";
import { IonButton, IonContent, IonText } from "@ionic/angular/standalone";
import { InputComponent } from "src/app/v1/component/atom/input/input.component";
import { TemplateService } from "src/app/v1/service/api/template.service";
import { EditTitleComponent } from "../../../../component/title/edit-title/edit-title.component";
import { List, ListItemOptions } from "src/app/v1/interface/app.interface";
import { ListComponent } from "../../../../component/organism/list/list.component";
import { ListItemComponent } from "src/app/v1/component/organism/list-item/list-item.component";

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
    ListItemComponent
],
})
export class GroupListPage {
  readonly fieldList = new List();
  readonly groupList = new List();

  readonly template = signal<ITemplate | undefined>(undefined);
  readonly group = signal<IGroup | undefined>(undefined);
  readonly title = signal<string>("");

  readonly descriptionControl = new FormControl<string | null>(null);
  readonly navigationService = inject(NavigationService);

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

  private resetPage() {
    // this.groupSelectOptions.required.set(true);
    this.descriptionControl.setValue(null);
    // this.groupSelectOptions.control.setValue(null);

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
