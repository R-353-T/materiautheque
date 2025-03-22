import { Component, ElementRef, inject, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ImageService } from "src/app/v1/service/api/image.service";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { HeaderComponent } from "src/app/v1/component/organism/header/header.component";
import { SubmitButtonComponent } from "../../../component/form/submit-button/submit-button.component";
import { IonContent } from "@ionic/angular/standalone";
import { ToastService } from "src/app/v1/service/toast.service";
import { FormComponent } from "../../../component/form/form/form.component";
import { FORM__IMAGE } from "src/app/v1/form/f.image";
import { InputComponent } from "../../../component/form/input/input.component";

@Component({
  selector: "app-image-create",
  templateUrl: "./image-create.page.html",
  styleUrls: ["./image-create.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    SubmitButtonComponent,
    FormComponent,
    InputComponent
],
})
export class ImageCreatePage {
  @ViewChild("inputFile")
  inputFile?: ElementRef;

  readonly baseForm = FORM__IMAGE;
  private readonly navigationService = inject(NavigationService);
  private readonly toastService = inject(ToastService);
  private readonly imageService = inject(ImageService);

  ionViewWillEnter() {
    this.baseForm.reset();
    
    if(this.inputFile) {
      this.inputFile.nativeElement.value = "";
    }

    this.navigationService.backTo = this.navigationService.lastPage;
  }

  create() {
    if (this.baseForm.isOk(true) && this.baseForm.lock()) {
      this.imageService.create(this.baseForm)
        .subscribe({
          next: async (response) => {
            this.toastService.showSuccessCreate(response.name);
            await this.navigationService.goToImage(response.id);
          },
          error: (error) => {
            this.baseForm.httpError(error);
            this.baseForm.unlock();
          },
        });
    }
  }
}
