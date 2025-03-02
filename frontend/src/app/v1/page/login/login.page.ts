import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonContent, IonInput } from "@ionic/angular/standalone";
import { AuthService } from "src/app/v1/service/api/auth/auth.service";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { AUTH_LOGIN_FORM } from "src/app/v1/form/auth.form";
import { SubmitButtonComponent } from "../../component/form/submit-button/submit-button.component";
import { BadRequestError } from "src/app/v1/error/BadRequestError";
import { TooManyRequestError } from "src/app/v1/error/TooManyRequestError";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    IonInput,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SubmitButtonComponent,
  ],
})
export class LoginPage {
  readonly form = AUTH_LOGIN_FORM;
  readonly authService = inject(AuthService);

  private readonly navigationService = inject(NavigationService);

  ionViewWillEnter = () => this.form.reset();

  login() {
    if (this.form.valid()) {
      this.form.formGroup.disable();

      this.authService.login(this.form).subscribe({
        next: async (response) => (await this.navigationService.goToHome()),

        error: (error) => {
          this.form.formGroup.enable();

          if (error instanceof BadRequestError) {
            this.form.applyBadRequestErrors(error.params);
          } else if (error instanceof TooManyRequestError) {
            this.form.formGroup.setErrors({ too_many_requests: error.message });
          } else if (error.status === 403) {
            this.form.formGroup.setErrors({ auth_forbidden: true });
          }
        },
      });
    }
  }
}
