import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { FormService } from "src/app/v1/service/api/form.service";
import { IonContent } from "@ionic/angular/standalone";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { SubmitButtonComponent } from "../../../component/form/submit-button/submit-button.component";
import { ToastService } from "src/app/v1/service/toast.service";
import { HeaderService } from "src/app/v1/service/header/header.service";
import { ITemplate } from "src/app/v1/interface/template.interface";
import { take } from "rxjs";
import { FormComponent } from "../../../component/form/form/form.component";
import { FORM__FORM } from "src/app/v1/form/f.form";
import { FilterType } from "src/app/v1/interface/app.interface";
import { InputComponent } from "../../../component/atom/input/input.component";
import { FormGroupComponent } from "../../../component/form/form-group/form-group.component";

@Component({
  selector: "app-form-create",
  templateUrl: "./form-create.page.html",
  styleUrls: ["./form-create.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    SubmitButtonComponent,
    FormComponent,
    InputComponent,
    FormGroupComponent
],
})
export class FormCreatePage {
  readonly baseForm = FORM__FORM;
  readonly template = signal<ITemplate | undefined>(undefined);
  readonly headerService = inject(HeaderService);
  readonly summarySelection = signal<FilterType>(null);

  private readonly formService = inject(FormService);
  private readonly toastService = inject(ToastService);
  private readonly navigationService = inject(NavigationService);
  private readonly route = inject(ActivatedRoute);

  ionViewWillEnter() {
    this.template.set(undefined);
    this.baseForm.reset();

    this.route.data
      .pipe(take(1))
      .subscribe({
      next: (data) => {
        const template = data["template"] as ITemplate;
        this.template.set(template);
        this.baseForm.reset(template);

        const affixe = template.name.replace("Matériaux", "Matériau").replace("Tests", "Test"); // TODO: find a better way to do this
        this.headerService.title = `Nouveau ${affixe}`;
        this.navigationService.backTo = this.navigationService.lastPage;
      },
    });
  }

  create() {
    console.log(this.baseForm.isOk(true))

    if(this.baseForm.isOk(true) && this.baseForm.lock()) {
      this.formService.create(this.baseForm).subscribe({
        next: async (response) => {
          this.toastService.showSuccessCreate(response.name);
          await this.navigationService.goToForm(response.id);
        },
        error: (error) => {
          this.baseForm.httpError(error);
          this.baseForm.unlock();
        },
      })
    }
  }
}
