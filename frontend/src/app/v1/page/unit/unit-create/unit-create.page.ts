import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HeaderComponent } from "../../../component/organism/header/header.component";
import { UnitService } from "src/app/v1/service/api/unit.service";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { SubmitButtonComponent } from "../../../component/form/submit-button/submit-button.component";
import { ToastService } from "src/app/v1/service/toast.service";
import { IonContent } from "@ionic/angular/standalone";
import { FORM__UNIT } from "src/app/v1/form/f.unit";
import { InputComponent } from "../../../component/form/input/input.component";
import { FormComponent } from "../../../component/form/form/form.component";
import { UnitInputValueListComponent } from "../../../component/form/unit/input-value-list/unit-input-value-list.component";

@Component({
  selector: "app-unit-create",
  templateUrl: "./unit-create.page.html",
  styleUrls: ["./unit-create.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    SubmitButtonComponent,
    InputComponent,
    FormComponent,
    UnitInputValueListComponent
],
})
export class UnitCreatePage {
  readonly baseForm = FORM__UNIT;

  private readonly unitService = inject(UnitService);
  private readonly navigationService = inject(NavigationService);
  private readonly toastService = inject(ToastService);

  ionViewWillEnter() {
    this.baseForm.reset();
    this.navigationService.backTo = this.navigationService.lastPage;
  }

  create() {
    if (this.baseForm.isOk() && this.baseForm.lock()) {
      this.unitService.create(this.baseForm).subscribe({
        next: async (response) => {
          this.toastService.showSuccessCreate(response.name);
          await this.navigationService.goToUnit(response.id);
        },
        error: (error) => {
          this.baseForm.httpError(error);
          this.baseForm.unlock();
        },
      });
    }
  }
}
