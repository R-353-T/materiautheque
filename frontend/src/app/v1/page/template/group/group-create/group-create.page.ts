import { Component, inject, OnInit, Signal, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { TemplateGroupService } from "src/app/v1/service/api/template-group.service";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { ActivatedRoute } from "@angular/router";
import { take } from "rxjs";
import { ITemplate } from "src/app/v1/interface/template.interface";
import { GROUP_CREATE_FORM } from "src/app/v1/form/group.form";
import { IGroup } from "src/app/v1/interface/group.interface";
import { SubmitButtonComponent } from "src/app/v1/component/form/submit-button/submit-button.component";
import { ToastService } from "src/app/v1/service/toast.service";
import { IonContent, IonInput, IonTextarea } from "@ionic/angular/standalone";

@Component({
  selector: "app-group-create",
  templateUrl: "./group-create.page.html",
  styleUrls: ["./group-create.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    IonInput,
    IonTextarea,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    SubmitButtonComponent
],
})
export class GroupCreatePage {
  readonly form = GROUP_CREATE_FORM;

  readonly template = signal<ITemplate | undefined>(undefined);
  readonly parentGroup = signal<IGroup | undefined>(undefined);

  private readonly groupService = inject(TemplateGroupService);
  private readonly navigationService = inject(NavigationService);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);

  ionViewWillEnter() {
    this.navigationService.backTo = this.navigationService.lastPage;
    this.template.set(undefined);
    this.parentGroup.set(undefined);
    this.form.reset();

    this.route.data
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          const template = data["template"] as ITemplate | undefined;
          const parentGroup = data["group"] as IGroup | undefined;

          this.template.set(template);
          this.parentGroup.set(parentGroup);

          if (template) {
            this.form.templateId.setValue(template.id);
          }

          if (parentGroup) {
            this.form.parentId.setValue(parentGroup.id);
          }
        },
      });
  }

  create() {
    if (this.form.valid()) {
      this.form.formGroup.disable();

      this.groupService.create(this.form).subscribe({
        next: async (response) => {
          this.toastService.showSuccessCreate(response.name);
          await this.navigationService.goToTemplateGroupList(
            response.templateId,
            response.id,
          );
        },
        error: (error) => {
          // this.form.formGroup.enable();
          // if (error instanceof BadRequestError) {
          //   this.form.applyBadRequestErrors(error.params);
          // } else {
          //   this.form.formGroup.setErrors({ not_implemented: true });
          // }
        },
      });
    }
  }
}
