import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { ActivatedRoute } from "@angular/router";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { take } from "rxjs";
import { TemplateService } from "src/app/v1/service/api/template.service";
import { TemplateFieldService } from "src/app/v1/service/api/template-field.service";
import { IGroup } from "src/app/v1/interface/group.interface";
import { ITemplate } from "src/app/v1/interface/template.interface";
import { SubmitButtonComponent } from "src/app/v1/component/form/submit-button/submit-button.component";
import { ToastService } from "src/app/v1/service/toast.service";
import { FORM__FIELD } from "src/app/v1/form/f.field";
import { FormComponent } from "../../../../component/form/form/form.component";
import { TypeService } from "src/app/v1/service/api/type.service";
import { InputComponent } from "../../../../component/atom/input/input.component";
import { SelectComponent } from "src/app/v1/component/atom/select/select.component";
import { IonContent, IonToggle } from "@ionic/angular/standalone";

@Component({
  selector: "app-field-create",
  templateUrl: "./field-create.page.html",
  styleUrls: ["./field-create.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    IonToggle,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    SubmitButtonComponent,
    FormComponent,
    InputComponent,
    SelectComponent,
  ],
})
export class FieldCreatePage {
  readonly baseForm = FORM__FIELD;
  readonly template = signal<ITemplate | undefined>(undefined);
  readonly typeService = inject(TypeService);

  // readonly groupSelectValueList = signal<ISelectValue[]>([]);

  private readonly route = inject(ActivatedRoute);
  private readonly navigationService = inject(NavigationService);
  private readonly templateService = inject(TemplateService);
  private readonly toastService = inject(ToastService);
  private readonly fieldService = inject(TemplateFieldService);

  ionViewWillEnter() {
    this.resetPage();

    this.route.data
      .pipe(take(1))
      .subscribe({
        next: async (data) => this.setupForm(data["group"] as IGroup),
      });
  }

  create() {
    if (this.baseForm.isOk(true) && this.baseForm.lock()) {
      this.fieldService.create(this.baseForm).subscribe({
        next: async (response) => {
          this.toastService.showSuccessCreate(response.name);
          await this.navigationService.goToTemplateField(
            response.groupId,
            response.id,
          );
        },
        error: (error) => {
          this.baseForm.httpError(error);
          this.baseForm.unlock();
        },
      });
    }
  }

  private setupForm(group: IGroup) {
    this.baseForm.groupId.setValue(group.id);

    this.templateService.get(group.templateId).subscribe({
      next: (template) => {
        this.template.set(template);
        const groupSelectValueList = this.templateService
          .mapTemplateAsSelectValueList(template);
        groupSelectValueList.shift();
        groupSelectValueList.forEach((g) => (g.depth = (g.depth ?? 1) - 1));
        // this.groupSelectValueList.set(groupSelectValueList);
      },
    });
  }

  private resetPage() {
    this.baseForm.reset();
    this.template.set(undefined);
    this.navigationService.backTo = this.navigationService.lastPage;
  }
}
