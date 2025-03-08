import { Component, computed, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { FormService } from "src/app/v1/service/api/form.service";
import { ITemplate } from "src/app/v1/interface/template.interface";
import { IonContent, IonInput } from "@ionic/angular/standalone";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { take } from "rxjs";
import { FormGroupSummaryComponent } from "../../../component/form/form-group-summary/form-group-summary.component";
import { __FORM__ } from "src/app/v1/form/form";
import { FGroup } from "src/app/v1/form/form-group.form";
import { FormForm } from "src/app/v1/form/form.form";
import { FormGroupContentComponent } from "src/app/v1/component/form/form-group-content/form-group-content.component";
import { SubmitButtonComponent } from "../../../component/form/submit-button/submit-button.component";
import { ToastService } from "src/app/v1/service/toast.service";
import { BadRequestError } from "src/app/v1/error/BadRequestError";

@Component({
  selector: "app-form-create",
  templateUrl: "./form-create.page.html",
  styleUrls: ["./form-create.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    IonInput,
    CommonModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    FormGroupSummaryComponent,
    FormGroupContentComponent,
    SubmitButtonComponent,
  ],
})
export class FormCreatePage {
  form = __FORM__;
  readonly template = signal<ITemplate | undefined>(undefined);

  readonly activeGroupId = signal<number>(0);
  readonly activeSection = computed<FGroup | FormForm>(() =>
    this.form.getSection(this.activeGroupId())
  );

  private readonly navigationService = inject(NavigationService);
  private readonly formService = inject(FormService);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);

  ionViewWillEnter() {
    this.template.set(undefined);

    this.route.data.pipe(take(1)).subscribe({
      next: (data) => {
        this.template.set(data["template"] as ITemplate);
        this.form.open(data["template"] as ITemplate);
        this.navigationService.backTo = this.navigationService.lastPage;
        this.form.lock.set(false);
      },
    });
  }

  create() {
    console.log(this.form.valueList);
    
    if (this.form.validateAll(true)) {
      this.form.lock.set(true);

      this.formService.create(this.form).subscribe({
        next: async (form) => {
          this.toastService.showSuccessCreate(form.name);
          await this.navigationService.goToForm(form.id);
        },
        error: (error) => {
          this.form.lock.set(false);
          if (error instanceof BadRequestError) {
            console.log("BAD REQUEST", error);
            // this.form.applyBadRequestErrors(error.params);
          } else {
            console.log("INTERNAL ERROR", error);
            // this.form.formGroup.setErrors({ not_implemented: true });
          }
        },
      });
    }
  }
}
