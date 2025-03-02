import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { ActivatedRoute } from "@angular/router";
import { EnumeratorService } from "src/app/v1/service/api/enumerator.service";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { ENUMERATOR_UPDATE_FORM } from "src/app/v1/form/enumerator.form";
import { AlertService } from "src/app/v1/service/alert.service";
import { SubmitButtonComponent } from "src/app/v1/component/form/submit-button/submit-button.component";
import { IEnumerator } from "src/app/v1/interface/enumerator.interface";
import { Subscription, take } from "rxjs";
import { ToastService } from "src/app/v1/service/toast.service";
import { BadRequestError } from "src/app/v1/error/BadRequestError";
import { InputValueListComponent } from "src/app/v1/component/form/enumerator/input-value-list/input-value-list.component";
import {
  IonButton,
  IonContent,
  IonInput,
  IonTextarea,
} from "@ionic/angular/standalone";
import { SelectTypeComponent } from "../../../component/form/select-type/select-type.component";

@Component({
  selector: "app-enumerator-edit",
  templateUrl: "./enumerator-edit.page.html",
  styleUrls: ["./enumerator-edit.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    IonInput,
    IonTextarea,
    IonButton,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    SubmitButtonComponent,
    InputValueListComponent,
    SelectTypeComponent
],
})
export class EnumeratorEditPage implements OnInit, OnDestroy {
  readonly form = ENUMERATOR_UPDATE_FORM;

  private readonly enumeratorService = inject(EnumeratorService);
  private readonly navigationService = inject(NavigationService);
  private readonly toastService = inject(ToastService);

  private readonly alertService = inject(AlertService);
  private readonly route = inject(ActivatedRoute);

  private typeChangeSubscription ?: Subscription;

  ngOnInit() {
    this.typeChangeSubscription = this.form.typeId.valueChanges.subscribe(() => {
      if(this.form.typeId.enabled) {
        this.form.valueList.clear();
      }
    });
  }

  ngOnDestroy() {
    this.typeChangeSubscription?.unsubscribe();
  }

  ionViewWillEnter() {
    this.navigationService.backTo = this.navigationService.lastPage;
    this.form.origin = undefined;
    this.form.reset();

    this.route.data.pipe(take(1))
      .subscribe({
        next: (data) => {
          this.form.origin = data["enumerator"] as IEnumerator;
          this.form.reset();
        },
      });
  }

  async update() {
    if (this.form.valid()) {
      this.form.formGroup.disable();

      await this.alertService.confirmEdit(
        () =>
          this.enumeratorService.update(this.form).subscribe({
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
          this.enumeratorService.delete(id).subscribe({
            next: async () => {
              this.navigationService.backTo = undefined;
              this.toastService.showSuccessDelete(this.form.name.value);
              await this.navigationService.goToEnumeratorList();
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
