import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { CreateImageForm } from 'src/app/models/form.image';
import { NavigationService } from 'src/app/services/navigation.service';
import { FormWrapperComponent } from "../../../components/form/form-wrapper/form-wrapper.component";
import { ButtonComponent } from "../../../components/button/button.component";
import { ApiImageService } from 'src/app/services/api.image.service';

@Component({
  selector: 'app-create-image',
  templateUrl: './create-image.page.html',
  styleUrls: ['./create-image.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, FormWrapperComponent, ButtonComponent]
})
export class CreateImagePage {
  readonly form = new CreateImageForm();
  readonly navigationService = inject(NavigationService);
  readonly loadingSignal = signal<boolean>(false);

  private readonly _apiImageService = inject(ApiImageService);

  ionViewWillEnter() {
    this.form.reset();
  }

  onSubmit() {
    if(this.form.isValid()) {
      this.loadingSignal.set(true);

      this._apiImageService
        .create(this.form)
        .subscribe({
          next: async (response) => {
            await this.navigationService.goToImage(response.data.id);
            this.loadingSignal.set(false);
          },
          error: (httpErrorResponse) => {
            this.form.setHttpErrors(httpErrorResponse);
            this.loadingSignal.set(false);
          }
        })
    }
  }
}
