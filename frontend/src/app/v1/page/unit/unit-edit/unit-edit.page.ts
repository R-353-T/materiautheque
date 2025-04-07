import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { take } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { UnitService } from "src/app/v1/service/api/unit.service";
import { SubmitButtonComponent } from "src/app/v1/component/form/submit-button/submit-button.component";
import { IUnit } from "src/app/v1/interface/unit.interface";
import { AlertService } from "src/app/v1/service/alert.service";
import { ToastService } from "src/app/v1/service/toast.service";
import { IonButton, IonContent } from "@ionic/angular/standalone";
import { FORM__UNIT } from "src/app/v1/form/f.unit";
import { FormComponent } from "../../../component/form/form/form.component";
import { InputComponent } from "../../../component/atom/input/input.component";
import { UnitInputValueListComponent } from "src/app/v1/component/unit/unit-input-value-list/unit-input-value-list.component";

@Component({
  selector: "app-unit-edit",
  templateUrl: "./unit-edit.page.html",
  styleUrls: ["./unit-edit.page.scss"],
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
    UnitInputValueListComponent
  ],
})
export class UnitEditPage {
  readonly baseForm = FORM__UNIT;
  unit?: IUnit;
  private readonly unitService = inject(UnitService);
  private readonly navigationService = inject(NavigationService);
  private readonly alertService = inject(AlertService);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);

  ionViewWillEnter() {
    this.navigationService.backTo = this.navigationService.lastPage;
    this.baseForm.reset();

    this.route.data.pipe(take(1))
      .subscribe({
        next: (data) => {
          this.unit = data["unit"] as IUnit;
          this.baseForm.reset(this.unit);
        },
      });
  }

  async update() {
    if (this.baseForm.isOk(true) && this.baseForm.lock()) {
      await this.alertService.confirmEdit(
        () =>
          this.unitService.update(this.baseForm).subscribe({
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

  async delete() {
    if (this.baseForm.lock()) {
      await this.alertService.confirmDelete(
        () =>
          this.unitService.delete(this.baseForm.id.value).subscribe({
            next: async () => {
              this.navigationService.backTo = undefined;
              this.toastService.showSuccessDelete(this.baseForm.name.value);
              await this.navigationService.goToUnitList();
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
