import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { ActivatedRoute } from "@angular/router";
import { take } from "rxjs";
import { TemplateGroupService } from "src/app/v1/service/api/template-group.service";
import { ITemplate } from "src/app/v1/interface/template.interface";
import { GROUP_UPDATE_FORM } from "src/app/v1/form/group.form";
import { AlertService } from "src/app/v1/service/alert.service";
import { IGroup } from "src/app/v1/interface/group.interface";
import { SubmitButtonComponent } from "src/app/v1/component/form/submit-button/submit-button.component";
import { ToastService } from "src/app/v1/service/toast.service";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonTextarea,
} from "@ionic/angular/standalone";
import { BadRequestError } from "src/app/v1/error/BadRequestError";
import { SelectGroupComponent } from "../../../../component/form/select-group/select-group.component";

@Component({
  selector: "app-group-edit",
  templateUrl: "./group-edit.page.html",
  styleUrls: ["./group-edit.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    IonInput,
    IonIcon,
    IonTextarea,
    IonButton,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    SubmitButtonComponent,
    SelectGroupComponent,
  ],
})
export class GroupEditPage {
  readonly form = GROUP_UPDATE_FORM;

  readonly template = signal<ITemplate | undefined>(undefined);

  private readonly navigationService = inject(NavigationService);
  private readonly groupService = inject(TemplateGroupService);
  private readonly alertService = inject(AlertService);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);

  ionViewWillEnter() {
    this.navigationService.backTo = this.navigationService.lastPage;
    this.form.origin = undefined;
    this.form.reset();

    this.route.data.pipe(take(1))
      .subscribe({
        next: (data) => {
          const template = data["template"] as ITemplate;
          this.form.origin = data["group"] as IGroup;

          if(template) {
            this.template.set(template);
          }

          this.form.reset();
        },
      });
  }

  async update() {
    if (this.form.valid()) {
      this.form.formGroup.disable();

      await this.alertService.confirmEdit(
        () =>
          this.groupService.update(this.form).subscribe({
            next: async (response) => {
              this.toastService.showSuccessUpdate(response.name);
              await this.navigationService.lastPage();
            },
            error: (error) => {
              this.form.formGroup.enable();
              if (error instanceof BadRequestError) {
                this.form.applyBadRequestErrors(error.params);
              } else {
                this.form.formGroup.setErrors({ not_implemented: true });
              }
            },
          }),
        () => this.form.formGroup.enable(),
      );
    }
  }

  async delete() {
    if (this.form.formGroup.enabled) {
      this.form.formGroup.disable();
      const id = this.form.id.value;

      await this.alertService.confirmDelete(
        () =>
          this.groupService.delete(id!).subscribe({
            next: async () => {
              this.navigationService.backTo = undefined;
              this.toastService.showSuccessDelete(this.form.name.value);
              await this.navigationService.goToTemplateGroupList(
                this.template()!.id,
                this.form.origin!.parentId ?? undefined,
              );
            },
            error: (error) => {
              if (error instanceof BadRequestError) {
                this.form.applyBadRequestErrors(error.params);
              } else {
                this.form.formGroup.setErrors({ not_implemented: true });
              }
            },
          }),
        () => this.form.formGroup.enable(),
      );
    }
  }
}
