import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { EnumeratorService } from "src/app/v1/service/api/enumerator.service";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { ENUMERATOR_CREATE_FORM } from "src/app/v1/form/enumerator.form";
import { SubmitButtonComponent } from "src/app/v1/component/form/submit-button/submit-button.component";
import { ToastService } from "src/app/v1/service/toast.service";
import { BadRequestError } from "src/app/classes/errors/BadRequestError";
import { IonContent, IonInput, IonTextarea } from "@ionic/angular/standalone";
import { InputValueListComponent } from "src/app/v1/component/form/enumerator/input-value-list/input-value-list.component";
import { SelectTypeComponent } from "../../../component/form/select-type/select-type.component";
import { Subscription } from "rxjs";

@Component({
  selector: "app-enumerator-create",
  templateUrl: "./enumerator-create.page.html",
  styleUrls: ["./enumerator-create.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    IonInput,
    IonTextarea,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    SubmitButtonComponent,
    InputValueListComponent,
    SelectTypeComponent
],
})
export class EnumeratorCreatePage implements OnInit, OnDestroy {
  readonly form = ENUMERATOR_CREATE_FORM;

  private readonly enumeratorService = inject(EnumeratorService);
  private readonly navigationService = inject(NavigationService);
  private readonly toastService = inject(ToastService);

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
    this.form.reset();
    this.navigationService.backTo = this.navigationService.lastPage;
  }

  create() {
    if (this.form.valid()) {
      this.form.formGroup.disable();
      this.enumeratorService.create(this.form).subscribe({
        next: async (response) => {
          this.toastService.showSuccessCreate(response.name);
          await this.navigationService.goToEnumerator(response.id);
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
