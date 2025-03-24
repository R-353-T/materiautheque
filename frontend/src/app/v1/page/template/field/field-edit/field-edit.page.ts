import { Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { ActivatedRoute } from "@angular/router";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { TemplateService } from "src/app/v1/service/api/template.service";
import { TemplateFieldService } from "src/app/v1/service/api/template-field.service";
import { Subscription, take } from "rxjs";
import { ITemplate } from "src/app/v1/interface/template.interface";
import { IGroup } from "src/app/v1/interface/group.interface";
import { IField } from "src/app/v1/interface/field.interface";
import { FIELD_UPDATE_FORM } from "src/app/v1/form/field.form";
import { AlertService } from "src/app/v1/service/alert.service";
import { SubmitButtonComponent } from "src/app/v1/component/form/submit-button/submit-button.component";
import { ToastService } from "src/app/v1/service/toast.service";
import {
  IonButton,
  IonContent,
  IonToggle,
} from "@ionic/angular/standalone";
import { TypeEnum } from "src/app/v1/enum/Type";

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
    SubmitButtonComponent,
  ],
})
export class FieldEditPage implements OnInit, OnDestroy {
  readonly form = FIELD_UPDATE_FORM;
  readonly template = signal<ITemplate | undefined>(undefined);
  readonly group = signal<IGroup | undefined>(undefined);

  private readonly navigationService = inject(NavigationService);
  private readonly templateService = inject(TemplateService);
  private readonly fieldService = inject(TemplateFieldService);
  private readonly alertService = inject(AlertService);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);

  private enumeratorSubscription?: Subscription;
  private typeSubscription?: Subscription;

  ngOnInit() {
    this.enumeratorSubscription = this.form.enumeratorId.valueChanges.subscribe(
      {
        next:
          () => (this.form.enumeratorId.enabled &&
            this.form.enumeratorId.value !== null &&
            this.form.updateEnumerator()),
      },
    );

    this.typeSubscription = this.form.typeId.valueChanges.subscribe({
      next: () => {
        if (this.form.typeId.enabled && this.form.typeId.value !== null
          && this.form.typeId.value !== TypeEnum.ENUMERATOR
        ) {
          this.form.updateType();
        }
      },
    });
  }

  ngOnDestroy() {
    this.enumeratorSubscription?.unsubscribe();
    this.typeSubscription?.unsubscribe();
  }

  ionViewWillEnter() {
    this.navigationService.backTo = this.navigationService.lastPage;
    this.form.origin = undefined;
    this.form.reset();

    this.route.data.pipe(take(1))
      .subscribe({
        next: (data) => {
          this.group.set(data["group"] as IGroup);
          this.form.origin = data["field"] as IField;

          this.templateService.get(this.group()!.templateId).subscribe({
            next: (template) => this.template.set(template),
          });

          this.form.reset();
        },
      });
  }

  async update() {
    // if (this.form.valid()) {
    //   this.form.formGroup.disable();

    //   await this.alertService.confirmEdit(
    //     () =>
    //       this.fieldService.update(this.form).subscribe({
    //         next: async (response) => {
    //           this.toastService.showSuccessUpdate(response.name);
    //           await this.navigationService.lastPage();
    //         },
    //         error: (error) => {
    //           // this.form.formGroup.enable();
    //           // if (error instanceof BadRequestError) {
    //           //   this.form.applyBadRequestErrors(error.params);
    //           // } else {
    //           //   this.form.formGroup.setErrors({ not_implemented: true });
    //           // }
    //         },
    //       }),
    //     () => this.form.formGroup.enable(),
    //   );
    // }
  }

  async delete() {
    if (this.form.formGroup.enabled) {
      this.form.formGroup.disable();
      const id = this.form.id.value;

      await this.alertService.confirmDelete(
        () =>
          this.fieldService.delete(id).subscribe({
            next: async () => {
              this.toastService.showSuccessDelete(this.form.name.value);
              this.navigationService.backTo = undefined;
              await this.navigationService.goToTemplateGroupList(
                this.group()!.templateId,
                this.group()!.id,
              );
            },
            error: (error) => {
              // if (error instanceof BadRequestError) {
              //   this.form.applyBadRequestErrors(error.params);
              // } else {
              //   this.form.formGroup.setErrors({ not_implemented: true });
              // }
            },
          }),
        () => this.form.formGroup.enable(),
      );
    }
  }
}
