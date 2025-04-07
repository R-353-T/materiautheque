import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { EnumeratorService } from "src/app/v1/service/api/enumerator.service";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { SubmitButtonComponent } from "src/app/v1/component/form/submit-button/submit-button.component";
import { ToastService } from "src/app/v1/service/toast.service";
import { IonContent } from "@ionic/angular/standalone";
import { InputValueListComponent } from "src/app/v1/component/enumerator/enumerator-input-value-list/enumerator-input-value-list.component";
import { FORM__ENUMERATOR } from "src/app/v1/form/f.enumerator";
import { FormComponent } from "../../../component/form/form/form.component";
import { InputComponent } from "../../../component/atom/input/input.component";
import { TypeSelectComponent } from "../../../component/type/type-select/type-select.component";

@Component({
  selector: "app-enumerator-create",
  templateUrl: "./enumerator-create.page.html",
  styleUrls: ["./enumerator-create.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    SubmitButtonComponent,
    InputValueListComponent,
    FormComponent,
    InputComponent,
    TypeSelectComponent
],
})
export class EnumeratorCreatePage {
  readonly baseForm = FORM__ENUMERATOR;

  private readonly enumeratorService = inject(EnumeratorService);
  private readonly navigationService = inject(NavigationService);
  private readonly toastService = inject(ToastService);

  ionViewWillEnter() {
    this.baseForm.reset();
    this.navigationService.backTo = this.navigationService.lastPage;
  }

  create() {
    if (this.baseForm.isOk(true) && this.baseForm.lock()) {
      this.enumeratorService.create(this.baseForm).subscribe({
        next: async (response) => {
          this.toastService.showSuccessCreate(response.name);
          await this.navigationService.goToEnumerator(response.id);
        },
        error: (error) => {
          this.baseForm.httpError(error);
          this.baseForm.unlock();
        },
      });
    }
  }
}
