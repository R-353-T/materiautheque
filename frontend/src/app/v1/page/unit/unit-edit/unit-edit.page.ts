import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { take } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { UnitService } from "src/app/v1/service/api/unit.service";
import { UNIT_UPDATE_FORM } from "src/app/v1/form/unit.form";
import { SubmitButtonComponent } from "src/app/v1/component/form/submit-button/submit-button.component";
import { IUnit } from "src/app/v1/interface/unit.interface";
import { AlertService } from "src/app/v1/service/alert.service";
import { ToastService } from "src/app/v1/service/toast.service";
import {
  IonButton,
  IonContent,
  IonInput,
  IonTextarea,
} from "@ionic/angular/standalone";
import { BadRequestError } from "src/app/v1/error/BadRequestError";
import { InputValueListComponent } from "src/app/v1/component/form/unit/input-value-list/input-value-list.component";

@Component({
  selector: "app-unit-edit",
  templateUrl: "./unit-edit.page.html",
  styleUrls: ["./unit-edit.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonInput,
    IonTextarea,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    InputValueListComponent,
    SubmitButtonComponent,
  ],
})
export class UnitEditPage {
  readonly form = UNIT_UPDATE_FORM;

  private readonly unitService = inject(UnitService);
  private readonly navigationService = inject(NavigationService);
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
          this.form.origin = data["unit"] as IUnit;
          this.form.reset();
        },
      });
  }

  async update() {
    if (this.form.valid()) {
      this.form.formGroup.disable();

      await this.alertService.confirmEdit(
        () =>
          this.unitService.update(this.form).subscribe({
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
          this.unitService.delete(id).subscribe({
            next: async () => {
              this.navigationService.backTo = undefined;
              this.toastService.showSuccessDelete(this.form.name.value);
              await this.navigationService.goToUnitList();
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
