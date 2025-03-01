import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ImageService } from "src/app/v1/service/api/image.service";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { IMAGE_CREATE_FORM } from "src/app/v1/form/image.form";
import { SubmitButtonComponent } from "../../../component/form/submit-button/submit-button.component";
import { IonContent, IonInput } from "@ionic/angular/standalone";
import { ToastService } from "src/app/v1/service/toast.service";
import { BadRequestError } from "src/app/classes/errors/BadRequestError";
import { InputImageComponent } from "../../../component/form/input-image/input-image.component";

@Component({
  selector: "app-image-create",
  templateUrl: "./image-create.page.html",
  styleUrls: ["./image-create.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    IonInput,
    HeaderComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SubmitButtonComponent,
    InputImageComponent,
  ],
})
export class ImageCreatePage {
  readonly form = IMAGE_CREATE_FORM;

  private readonly navigationService = inject(NavigationService);
  private readonly toastService = inject(ToastService);
  private readonly imageService = inject(ImageService);

  ionViewWillEnter() {
    this.form.reset();
    this.navigationService.backTo = this.navigationService.lastPage;
  }

  create() {
    if (this.form.valid()) {
      this.form.formGroup.disable();

      this.imageService.create(this.form).subscribe({
        next: async (response) => {
          this.toastService.showSuccessCreate(response.name);
          await this.navigationService.goToImage(response.id);
        },
        error: (error) => {
          this.form.formGroup.enable();
          if (error instanceof BadRequestError) {
            this.form.applyBadRequestErrors(error.params);
          } else if (error.error && (error.error as string).includes("limit")) {
            this.form.file.setErrors({ file_too_large: true });
          } else {
            this.form.formGroup.setErrors({ not_implemented: true });
          }
        },
      });
    }
  }
}
