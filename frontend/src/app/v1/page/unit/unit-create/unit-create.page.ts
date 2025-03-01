import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HeaderComponent } from "../../../component/organism/header/header.component";
import { UnitService } from "src/app/v1/service/api/unit.service";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { UNIT_CREATE_FORM } from "src/app/v1/form/unit.form";
import { SubmitButtonComponent } from "../../../component/form/submit-button/submit-button.component";
import { ToastService } from "src/app/v1/service/toast.service";
import { BadRequestError } from "src/app/classes/errors/BadRequestError";
import { IonContent, IonInput, IonTextarea } from "@ionic/angular/standalone";
import { InputValueListComponent } from "src/app/v1/component/form/unit/input-value-list/input-value-list.component";

@Component({
  selector: "app-unit-create",
  templateUrl: "./unit-create.page.html",
  styleUrls: ["./unit-create.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    IonInput,
    IonTextarea,
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    SubmitButtonComponent,
    InputValueListComponent
  ],
})
export class UnitCreatePage {
  readonly form = UNIT_CREATE_FORM;

  private readonly unitService = inject(UnitService);
  private readonly navigationService = inject(NavigationService);
  private readonly toastService = inject(ToastService);

  ionViewWillEnter() {
    this.form.reset();
    this.navigationService.backTo = this.navigationService.lastPage;
  }

  create() {
    if (this.form.valid()) {
      this.form.formGroup.disable();

      this.unitService.create(this.form).subscribe({
        next: async (response) => {
          this.toastService.showSuccessCreate(response.name);
          await this.navigationService.goToUnit(response.id);
        },
        error: (error) => {
          this.form.formGroup.enable();
          if (error instanceof BadRequestError) {
            this.form.applyBadRequestErrors(error.params);
          } else {
            this.form.formGroup.setErrors({ not_implemented: true });
          }
        },
      });
    }
  }
}
