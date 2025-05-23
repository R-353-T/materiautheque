import { Component, effect, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonContent } from "@ionic/angular/standalone";
import { LoginForm } from "src/app/models/form.login";
import { FormWrapperComponent } from "../../components/form/form-wrapper/form-wrapper.component";
import { ApiAuthenticationService } from "src/app/services/api.authentication.service";
import { TooManyRequestError } from "src/app/classes/too-many-request-error";
import { ApiService } from "src/app/services/api.service";
import { NavigationService } from "src/app/services/navigation.service";
import { ButtonComponent } from "../../components/button/button.component";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    FormWrapperComponent,
    ButtonComponent
],
})
export class LoginPage {
  readonly form = new LoginForm();
  readonly authService = inject(ApiAuthenticationService);
  readonly apiService = inject(ApiService);
  readonly loadingSignal = signal<boolean>(false);
  readonly tooManyRequestSignal = this.apiService.bucketLock.locked;

  private readonly _navigationService = inject(NavigationService);

  constructor() {
    effect(() => {
      if(this.tooManyRequestSignal() === false) {
        this.form.group.setErrors(null);
      }
    })
  }

  ionViewWillEnter() {
    this.form.reset();
  }

  onSubmit() {
    if (this.form.isValid()) {
      this.loadingSignal.set(true);

      this.authService.login(this.form).subscribe({
        next: () => {
          this._navigationService.goToHome();
          this.loadingSignal.set(false);
        },
        error: (error) => {
          if(error.status === 403) {
            this.form.group.setErrors({ auth_wrong_credentials: true });
            this.form.group.get("username")?.setErrors({});
            this.form.group.get("password")?.setErrors({});
          }

          if(error instanceof TooManyRequestError) {
            this.form.group.setErrors({ auth_too_many_request: error.errorMessage });
            this.form.group.get("username")?.setErrors({});
            this.form.group.get("password")?.setErrors({});
          }

          this.loadingSignal.set(false);
        }
      });
    }
  }
}
