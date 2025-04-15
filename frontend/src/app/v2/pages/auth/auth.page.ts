import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HeaderComponent } from "../../components/globals/header/header.component";
import { IonContent } from "@ionic/angular/standalone";
import { AuthForm } from "../../core/models/forms/auth.form";
import { FormComponent } from "../../components/globals/form/form.component";
import { ButtonSubmitComponent } from "../../components/buttons/button-submit/button-submit.component";
import { AuthService } from "../../services/auth/auth.service";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    HeaderComponent,
    FormComponent,
    ButtonSubmitComponent
],
})
export class AuthPage {
  readonly form = new AuthForm();
  readonly authService = inject(AuthService);

  
}
