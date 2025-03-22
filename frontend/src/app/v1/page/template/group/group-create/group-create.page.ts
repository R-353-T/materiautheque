import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { TemplateGroupService } from "src/app/v1/service/api/template-group.service";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { ActivatedRoute } from "@angular/router";
import { take } from "rxjs";
import { ITemplate } from "src/app/v1/interface/template.interface";
import { IGroup } from "src/app/v1/interface/group.interface";
import { SubmitButtonComponent } from "src/app/v1/component/form/submit-button/submit-button.component";
import { ToastService } from "src/app/v1/service/toast.service";
import { IonContent, IonInput, IonTextarea } from "@ionic/angular/standalone";
import { FORM__GROUP } from "src/app/v1/form/f.group";
import { FormComponent } from "../../../../component/form/form/form.component";
import { InputComponent } from "../../../../component/form/input/input.component";
import { SelectComponent } from "src/app/v1/component/form/select/select.component";
import { ISelectValue } from "src/app/v1/interface/app.interface";

@Component({
  selector: "app-group-create",
  templateUrl: "./group-create.page.html",
  styleUrls: ["./group-create.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    SubmitButtonComponent,
    FormComponent,
    InputComponent,
    SelectComponent
],
})
export class GroupCreatePage {
  readonly baseForm = FORM__GROUP;

  readonly template = signal<ITemplate | undefined>(undefined);
  readonly parentGroup = signal<IGroup | undefined>(undefined);
  readonly groupSelectValueList = signal<ISelectValue[]>([]);

  private readonly groupService = inject(TemplateGroupService);
  private readonly navigationService = inject(NavigationService);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);

  ionViewWillEnter() {
    this.resetPage();

    this.route.data
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          const template = data["template"] as ITemplate;
          const parentGroup = data["group"] as IGroup | undefined;

          this.template.set(template);
          this.parentGroup.set(parentGroup);
          this.mapTemplate(template, undefined);
          this.setupForm();
        },
      });
  }

  create() {
    if (this.baseForm.isOk(true) && this.baseForm.lock()) {
      this.groupService.create(this.baseForm).subscribe({
        next: async (response) => {
          this.toastService.showSuccessCreate(response.name);
          await this.navigationService.goToTemplateGroupList(
            response.templateId,
            response.id,
          );
        },
        error: (error) => {
          this.baseForm.httpError(error);
          this.baseForm.unlock();
        },
      });
    }
  }

  private setupForm() {
    if (this.template()) {
      this.baseForm.templateId.setValue(this.template()!.id);
    }

    if (this.parentGroup()) {
      this.baseForm.parentId.setValue(this.parentGroup()!.id);
    }
  }

  private resetPage() {
    this.navigationService.backTo = this.navigationService.lastPage;
    this.baseForm.reset();
    this.template.set(undefined);
    this.parentGroup.set(undefined);
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
