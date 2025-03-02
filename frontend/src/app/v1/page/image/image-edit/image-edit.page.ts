import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HeaderComponent } from "../../../component/organism/header/header.component";
import { ImageService } from "src/app/v1/service/api/image.service";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { ActivatedRoute } from "@angular/router";
import { take } from "rxjs";
import { IMAGE_UPDATE_FORM } from "src/app/v1/form/image.form";
import { IImage } from "src/app/v1/interface/image.interface";
import { AlertService } from "src/app/v1/service/alert.service";
import { SubmitButtonComponent } from "../../../component/form/submit-button/submit-button.component";
import { IonButton, IonContent, IonInput } from "@ionic/angular/standalone";
import { ToastService } from "src/app/v1/service/toast.service";
import { BadRequestError } from "src/app/v1/error/BadRequestError";
import { InputImageComponent } from "../../../component/form/input-image/input-image.component";

@Component({
  selector: "app-image-edit",
  templateUrl: "./image-edit.page.html",
  styleUrls: ["./image-edit.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    IonInput,
    IonButton,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    SubmitButtonComponent,
    InputImageComponent,
  ],
})
export class ImageEditPage {
  readonly form = IMAGE_UPDATE_FORM;
  
  private readonly imageService = inject(ImageService);
  private readonly navigationService = inject(NavigationService);
  private readonly alertService = inject(AlertService);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);

  ionViewWillEnter() {
    this.navigationService.backTo = this.navigationService.lastPage;
    this.form.origin = undefined;
    this.form.reset();

    this.route.data.pipe(take(1))
      .subscribe({
        next: (data) => {
          this.form.origin = data["image"] as IImage;
          this.form.reset();
        },
      });
  }

  async update() {
    if (this.form.valid(false)) {
      this.form.formGroup.disable();

      await this.alertService.confirmEdit(
        () =>
          this.imageService.update(this.form).subscribe({
            next: async (response) => {
              this.toastService.showSuccessUpdate(response.name);
              await this.navigationService.lastPage();
            },
            error: (error) => {
              this.form.formGroup.enable();
              if (error instanceof BadRequestError) {
                this.form.applyBadRequestErrors(error.params);
              } else {
                // todo - $ - custom file error
                if (error.error && (error.error as string).includes("limit")) {
                  this.form.file.setErrors({ file_too_large: true });
                } else {
                  this.form.formGroup.setErrors({ not_implemented: true });
                }
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
          this.imageService.delete(id).subscribe({
            next: async () => {
              this.navigationService.backTo = undefined;
              this.toastService.showSuccessDelete(this.form.name.value);
              await this.navigationService.goToImageList();
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
