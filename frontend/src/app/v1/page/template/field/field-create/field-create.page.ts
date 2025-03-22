import { Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { ActivatedRoute } from "@angular/router";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { Subscription, take } from "rxjs";
import { TemplateService } from "src/app/v1/service/api/template.service";
import { TemplateFieldService } from "src/app/v1/service/api/template-field.service";
import { FIELD_CREATE_FORM } from "src/app/v1/form/field.form";
import { IGroup } from "src/app/v1/interface/group.interface";
import { ITemplate } from "src/app/v1/interface/template.interface";
import { SubmitButtonComponent } from "src/app/v1/component/form/submit-button/submit-button.component";
import { ToastService } from "src/app/v1/service/toast.service";
import { SelectEnumeratorComponent } from "../../../../component/form/select-enumerator/select-enumerator.component";
import { SelectTypeComponent } from "../../../../component/form/select-type/select-type.component";
import { SelectUnitComponent } from "../../../../component/form/select-unit/select-unit.component";
import {
  IonContent,
  IonInput,
  IonTextarea,
  IonToggle,
} from "@ionic/angular/standalone";

@Component({
  selector: "app-field-create",
  templateUrl: "./field-create.page.html",
  styleUrls: ["./field-create.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    IonInput,
    IonToggle,
    IonTextarea,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    SubmitButtonComponent,
    SelectEnumeratorComponent,
    SelectTypeComponent,
    SelectUnitComponent
],
})
export class FieldCreatePage implements OnInit, OnDestroy {
  readonly form = FIELD_CREATE_FORM;
  readonly template = signal<ITemplate | undefined>(undefined);

  private readonly route = inject(ActivatedRoute);
  private readonly navigationService = inject(NavigationService);
  private readonly templateService = inject(TemplateService);
  private readonly toastService = inject(ToastService);
  private readonly fieldService = inject(TemplateFieldService);

  private enumeratorSubscription?: Subscription;
  private typeSubscription?: Subscription;

  ngOnInit() {
    this.enumeratorSubscription = this.form.enumeratorId.valueChanges.subscribe(
      {
        next: () => (this.form.enumeratorId.enabled && this.form.updateEnumerator()),
      },
    );

    this.typeSubscription = this.form.typeId.valueChanges.subscribe({
      next: () => {
        if(this.form.typeId.enabled) {
          this.form.updateType();
        }
      }
    });
  }

  ngOnDestroy() {
    this.enumeratorSubscription?.unsubscribe();
    this.typeSubscription?.unsubscribe();
  }

  ionViewWillEnter() {
    this.template.set(undefined);
    this.form.reset();
    this.navigationService.backTo = this.navigationService.lastPage;

    this.route.data.pipe(take(1))
      .subscribe({
        next: async (data) => {
          const group = data["group"] as IGroup;
          this.form.groupId.setValue(group.id);
          this.templateService.get(group.templateId).subscribe({
            next: (template) => this.template.set(template),
          });
        },
      });
  }

  create() {
    if (this.form.valid()) {
      this.form.formGroup.disable();

      this.fieldService.create(this.form).subscribe({
        next: async (response) => {
          this.toastService.showSuccessCreate(response.name);
          await this.navigationService.goToTemplateField(
            response.groupId,
            response.id,
          );
        },
        error: (error) => {
          // if (error instanceof BadRequestError) {
          //   this.form.applyBadRequestErrors(error.params);
          // } else {
          //   this.form.formGroup.setErrors({ not_implemented: true });
          // }
          // this.form.formGroup.enable();
        },
      });
    }
  }
}
