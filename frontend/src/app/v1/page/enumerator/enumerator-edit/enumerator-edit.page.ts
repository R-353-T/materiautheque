import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { ActivatedRoute } from "@angular/router";
import { EnumeratorService } from "src/app/v1/service/api/enumerator.service";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { AlertService } from "src/app/v1/service/alert.service";
import { SubmitButtonComponent } from "src/app/v1/component/form/submit-button/submit-button.component";
import { take } from "rxjs";
import { ToastService } from "src/app/v1/service/toast.service";
import { InputValueListComponent } from "src/app/v1/component/form/enumerator/input-value-list/enumerator-input-value-list.component";
import { FORM__ENUMERATOR } from "src/app/v1/form/f.enumerator";
import { FormComponent } from "../../../component/form/form/form.component";
import { InputComponent } from "../../../component/form/input/input.component";
import { IEnumerator } from "src/app/v1/interface/enumerator.interface";
import {
  IonButton,
  IonContent,
} from "@ionic/angular/standalone";
import { TypeSelectComponent } from "../../../component/type/type-select/type-select.component";

@Component({
  selector: "app-enumerator-edit",
  templateUrl: "./enumerator-edit.page.html",
  styleUrls: ["./enumerator-edit.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
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
export class EnumeratorEditPage {
  readonly baseForm = FORM__ENUMERATOR;
  enumerator?: IEnumerator;
  
  private readonly enumeratorService = inject(EnumeratorService);
  private readonly navigationService = inject(NavigationService);
  private readonly toastService = inject(ToastService);
  private readonly alertService = inject(AlertService);
  private readonly route = inject(ActivatedRoute);

  ionViewWillEnter() {
    this.navigationService.backTo = this.navigationService.lastPage;
    this.baseForm.reset();

    this.route.data
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.enumerator = data["enumerator"] as IEnumerator;
          this.baseForm.reset(this.enumerator);
        },
      });
  }

  async update() {
    if (this.baseForm.isOk(true) && this.baseForm.lock()) {
      await this.alertService.confirmEdit(
        () =>
          this.enumeratorService.update(this.baseForm).subscribe({
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
          this.enumeratorService.delete(this.baseForm.id.value).subscribe({
            next: async () => {
              this.navigationService.backTo = undefined;
              this.toastService.showSuccessDelete(this.baseForm.name.value);
              await this.navigationService.goToEnumeratorList();
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
