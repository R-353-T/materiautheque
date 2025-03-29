import { Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { TemplateService } from "src/app/v1/service/api/template.service";
import { TemplateFieldService } from "src/app/v1/service/api/template-field.service";
import { take } from "rxjs";
import { ITemplate } from "src/app/v1/interface/template.interface";
import { AlertService } from "src/app/v1/service/alert.service";
import { SubmitButtonComponent } from "src/app/v1/component/form/submit-button/submit-button.component";
import { ToastService } from "src/app/v1/service/toast.service";
import { HeaderComponent } from "../../../../component/organism/header/header.component";
import { InputComponent } from "../../../../component/atom/input/input.component";
import { GroupSelectComponent } from "../../../../component/group/group-select/group-select.component";
import { FormComponent } from "../../../../component/form/form/form.component";
import { EnumeratorSelectComponent } from "../../../../component/enumerator/enumerator-select/enumerator-select.component";
import { TypeSelectComponent } from "../../../../component/type/type-select/type-select.component";
import { UnitSelectComponent } from "../../../../component/unit/unit-select/unit-select.component";
import { FORM__FIELD } from "src/app/v1/form/f.field";
import {
  IonButton,
  IonContent,
  IonToggle,
} from "@ionic/angular/standalone";
import { IField } from "src/app/v1/interface/field.interface";
import { IGroup } from "src/app/v1/interface/group.interface";

@Component({
  selector: "app-field-edit",
  templateUrl: "./field-edit.page.html",
  styleUrls: ["./field-edit.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonToggle,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    InputComponent,
    GroupSelectComponent,
    FormComponent,
    EnumeratorSelectComponent,
    TypeSelectComponent,
    UnitSelectComponent,
    SubmitButtonComponent
],
})
export class FieldEditPage {
  readonly baseForm = FORM__FIELD;
  readonly template = signal<ITemplate | undefined>(undefined);

  private readonly navigationService = inject(NavigationService);
  private readonly templateService = inject(TemplateService);
  private readonly fieldService = inject(TemplateFieldService);
  private readonly alertService = inject(AlertService);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);

  ionViewWillEnter() {
    this.resetPage();

    this.route.data
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.baseForm.reset(data["field"] as IField);

          this.templateService.get((data["group"] as IGroup).templateId).subscribe({
            next: (template) => this.template.set(template),
          });
        }
      });
  }

  async update() {
    if (this.baseForm.isOk(true) && this.baseForm.lock()) {
      await this.alertService.confirmEdit(
        () =>
          this.fieldService.update(this.baseForm).subscribe({
            next: async (response) => {
              this.toastService.showSuccessUpdate(response.name);
              await this.navigationService.lastPage();
            },
            error: (error) => {
              this.baseForm.httpError(error);
              this.baseForm.unlock();
            },
          }),
        () => this.baseForm.unlock()
      );
    }
  }

  async delete() {
    if (this.baseForm.lock()) {
      await this.alertService.confirmDelete(
        () =>
          this.fieldService.delete(this.baseForm.id.value).subscribe({
            next: async () => {
              this.navigationService.backTo = undefined;
              this.toastService.showSuccessDelete(this.baseForm.name.value);
              await this.navigationService.goToTemplateGroupList(this.template()!.id, this.baseForm.groupId.value);
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
    this.baseForm.reset();
    this.template.set(undefined);
    this.navigationService.backTo = this.navigationService.lastPage;
  }
}
