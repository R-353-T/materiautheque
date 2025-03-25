import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonContent } from "@ionic/angular/standalone";
import { AuthService } from "src/app/v1/service/api/auth/auth.service";
import { NavigationService } from "src/app/v1/service/navigation/navigation.service";
import { SubmitButtonComponent } from "../../component/form/submit-button/submit-button.component";
import { BadRequestError } from "src/app/v1/error/BadRequestError";
import { TooManyRequestError } from "src/app/v1/error/TooManyRequestError";
import { FORM__LOGIN } from "../../form/f.login";
import { InputComponent } from "../../component/atom/input/input.component";
import { FormComponent } from "../../component/form/form/form.component";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SubmitButtonComponent,
    InputComponent,
    FormComponent
  ]
})
export class LoginPage {
  readonly baseForm = FORM__LOGIN;
  readonly authService = inject(AuthService);
  private readonly navigationService = inject(NavigationService);

  ionViewWillEnter() {
    this.baseForm.reset();
  }

  login() {
    if (this.baseForm.isOk(true) && this.baseForm.lock()) {
      this.authService.login(this.baseForm)
        .subscribe({
          next: async (r) => (await this.navigationService.goToHome()),

          error: (error) => {
            this.baseForm.httpError(error);
            this.baseForm.unlock();
          },
        });
    }
  }
}
