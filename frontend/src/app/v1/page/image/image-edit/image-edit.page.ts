import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HeaderComponent } from "../../../component/organism/header/header.component";
import { ImageService } from "src/app/v1/service/api/image.service";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { ActivatedRoute } from "@angular/router";
import { take } from "rxjs";
import { IImage } from "src/app/v1/interface/image.interface";
import { AlertService } from "src/app/v1/service/alert.service";
import { SubmitButtonComponent } from "../../../component/form/submit-button/submit-button.component";
import { IonButton, IonContent, IonInput } from "@ionic/angular/standalone";
import { ToastService } from "src/app/v1/service/toast.service";
import { FORM__IMAGE__UPDATE } from "src/app/v1/form/f.image";
import { FormComponent } from "../../../component/form/form/form.component";
import { InputComponent } from "../../../component/atom/input/input.component";

@Component({
  selector: "app-image-edit",
  templateUrl: "./image-edit.page.html",
  styleUrls: ["./image-edit.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    SubmitButtonComponent,
    FormComponent,
    InputComponent
],
})
export class ImageEditPage {
  readonly baseForm = FORM__IMAGE__UPDATE;
  image?: IImage;
  private readonly navigationService = inject(NavigationService);
  private readonly imageService = inject(ImageService);
  private readonly alertService = inject(AlertService);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);

  ionViewWillEnter() {
    this.navigationService.backTo = this.navigationService.lastPage;
    this.baseForm.reset();

    this.route.data.pipe(take(1))
      .subscribe({
        next: (data) => {
          this.image = data["image"] as IImage;
          this.baseForm.reset(this.image);
        }
      });
  }

  async update() {
    if (this.baseForm.isOk(true) && this.baseForm.lock()) {
      await this.alertService.confirmEdit(
        () =>
          this.imageService.update(this.baseForm).subscribe({
            next: async (response) => {
              this.toastService.showSuccessUpdate(response.name);
              await this.navigationService.lastPage();
            },
            error: (error) => {
              this.baseForm.httpError(error);
              this.baseForm.unlock();
            },
          }),
        () => this.baseForm.unlock()
      );
    }
  }

  async delete() {
    if (this.baseForm.lock()) {
      await this.alertService.confirmDelete(
        () =>
          this.imageService.delete(this.baseForm.id.value).subscribe({
            next: async () => {
              this.navigationService.backTo = undefined;
              this.toastService.showSuccessDelete(this.baseForm.name.value);
              await this.navigationService.goToImageList();
            },
            error: (error) => {
              this.baseForm.httpError(error);
              this.baseForm.unlock();
            },
          }),
        () => this.baseForm.unlock()
      );
    }
  }
}
