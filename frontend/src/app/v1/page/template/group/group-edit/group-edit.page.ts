import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { ActivatedRoute } from "@angular/router";
import { take } from "rxjs";
import { TemplateGroupService } from "src/app/v1/service/api/template-group.service";
import { ITemplate } from "src/app/v1/interface/template.interface";
import { AlertService } from "src/app/v1/service/alert.service";
import { IGroup } from "src/app/v1/interface/group.interface";
import { SubmitButtonComponent } from "src/app/v1/component/form/submit-button/submit-button.component";
import { ToastService } from "src/app/v1/service/toast.service";
import { FORM__GROUP } from "src/app/v1/form/f.group";
import { FormComponent } from "../../../../component/form/form/form.component";
import { InputComponent } from "../../../../component/atom/input/input.component";
import { TemplateService } from "src/app/v1/service/api/template.service";
import { IonButton, IonContent } from "@ionic/angular/standalone";
import { GroupSelectComponent } from "../../../../component/group/group-select/group-select.component";
import { GroupInputValueListComponent } from "src/app/v1/component/group/group-input-value-list/group-input-value-list.component";

@Component({
  selector: "app-group-edit",
  templateUrl: "./group-edit.page.html",
  styleUrls: ["./group-edit.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    SubmitButtonComponent,
    FormComponent,
    InputComponent,
    GroupInputValueListComponent,
    GroupSelectComponent
],
})
export class GroupEditPage {
  readonly baseForm = FORM__GROUP;
  readonly template = signal<ITemplate | undefined>(undefined);
  readonly group = signal<IGroup | undefined>(undefined);
  private readonly navigationService = inject(NavigationService);
  private readonly groupService = inject(TemplateGroupService);
  private readonly alertService = inject(AlertService);
  private readonly toastService = inject(ToastService);
  private readonly templateService = inject(TemplateService);
  private readonly route = inject(ActivatedRoute);

  ionViewWillEnter() {
    this.resetPage();
    this.navigationService.backTo = this.navigationService.lastPage;

    this.route.data
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          const template = data["template"] as ITemplate;
          const group = data["group"] as IGroup;

          this.template.set(template);
          this.group.set(group);
          this.baseForm.reset(this.group());
        },
      });
  }

  async update() {
    if (this.baseForm.isOk(true) && this.baseForm.lock()) {
      await this.alertService.confirmEdit(
        () =>
          this.groupService.update(this.baseForm).subscribe({
            next: async (response) => {
              this.toastService.showSuccessUpdate(response.name);
              await this.navigationService.lastPage();
            },
            error: (error) => {
              this.baseForm.httpError(error);
              this.baseForm.unlock();
            },
          }),
        () => this.baseForm.formGroup.enable(),
      );
    }
  }

  async delete() {
    if (this.baseForm.lock()) {
      await this.alertService.confirmDelete(
        () =>
          this.groupService.delete(this.baseForm.id.value).subscribe({
            next: async () => {
              const group = this.group();
              this.navigationService.backTo = undefined;
              this.toastService.showSuccessDelete(this.baseForm.name.value);
              await this.navigationService.goToTemplateGroupList(
                group!.templateId,
                group!.parentId ?? undefined,
              );
            },
            error: (error) => {
              this.baseForm.httpError(error);
              this.baseForm.unlock();
            },
          }),
        () => this.baseForm.unlock(),
      );
    }
  }

  private resetPage() {
    this.navigationService.backTo = this.navigationService.lastPage;
    this.baseForm.reset();
    this.template.set(undefined);
    this.group.set(undefined);
  }
}
