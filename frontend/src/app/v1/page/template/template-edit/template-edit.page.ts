import {
  IonButton,
  IonContent
} from "@ionic/angular/standalone";
import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { AlertService } from "src/app/v1/service/alert.service";
import { ToastService } from "src/app/v1/service/toast.service";
import { ActivatedRoute } from "@angular/router";
import { take } from "rxjs";
import { ITemplate } from "src/app/v1/interface/template.interface";
import { TemplateService } from "src/app/v1/service/api/template.service";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { SubmitButtonComponent } from "src/app/v1/component/form/submit-button/submit-button.component";
import { FormComponent } from "../../../component/form/form/form.component";
import { FORM__TEMPLATE } from "src/app/v1/form/f.template";
import { InputComponent } from "src/app/v1/component/atom/input/input.component";
import { GroupInputValueListComponent } from "../../../component/form/group/group-input-value-list/group-input-value-list.component";

@Component({
  selector: "app-template-edit",
  templateUrl: "./template-edit.page.html",
  styleUrls: ["./template-edit.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    CommonModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    SubmitButtonComponent,
    FormComponent,
    InputComponent,
    GroupInputValueListComponent
],
})
export class TemplateEditPage {
  readonly baseForm = FORM__TEMPLATE;
  template?: ITemplate;
  private readonly navigationService = inject(NavigationService);
  private readonly templateService = inject(TemplateService);
  private readonly alertService = inject(AlertService);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);

  ionViewWillEnter() {
    this.navigationService.backTo = this.navigationService.lastPage;
    this.baseForm.reset();

    this.route.data.pipe(take(1))
      .subscribe({
        next: (data) => {
          this.template = data["template"] as ITemplate;
          this.baseForm.reset(this.template);
        },
      });
  }

  async update() {
    if (this.baseForm.isOk(true) && this.baseForm.lock()) {
      await this.alertService.confirmEdit(
        () =>
          this.templateService.update(this.baseForm).subscribe({
            next: async (response) => {
              this.toastService.showSuccessUpdate(response.name);
              await this.navigationService.lastPage();
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
}
