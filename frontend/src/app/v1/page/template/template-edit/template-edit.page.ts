import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
} from "@ionic/angular/standalone";
import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TEMPLATE_UPDATE_FORM } from "src/app/v1/form/template.form";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { AlertService } from "src/app/v1/service/alert.service";
import { ToastService } from "src/app/v1/service/toast.service";
import { ActivatedRoute } from "@angular/router";
import { take } from "rxjs";
import { ITemplate } from "src/app/v1/interface/template.interface";
import { TemplateService } from "src/app/v1/service/api/template.service";
import { BadRequestError } from "src/app/v1/error/BadRequestError";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { SubmitButtonComponent } from "src/app/v1/component/form/submit-button/submit-button.component";

@Component({
  selector: "app-template-edit",
  templateUrl: "./template-edit.page.html",
  styleUrls: ["./template-edit.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonIcon,
    IonInput,
    CommonModule,
    FormsModule,
    HeaderComponent,
    CommonModule,
    ReactiveFormsModule,
    SubmitButtonComponent,
  ],
})
export class TemplateEditPage {
  readonly form = TEMPLATE_UPDATE_FORM;

  private readonly navigationService = inject(NavigationService);
  private readonly templateService = inject(TemplateService);
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
          this.form.origin = data["template"] as ITemplate;
          this.form.reset();
        },
      });
  }

  async update() {
    if (this.form.valid()) {
      this.form.formGroup.disable();

      await this.alertService.confirmEdit(
        () =>
          this.templateService.update(this.form).subscribe({
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
}
