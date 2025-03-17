import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { IonButton, IonSpinner } from "@ionic/angular/standalone";

@Component({
  selector: "app-submit-button",
  templateUrl: "./submit-button.component.html",
  styleUrls: ["./submit-button.component.scss"],
  standalone: true,
  imports: [IonButton, IonSpinner],
})
export class SubmitButtonComponent {
  @Input()
  loading = false;
  
  @Input()
  disabled = false;
  
  @Input()
  label = "Envoyer";

  @Output()
  submit = new EventEmitter<void>();

  onSubmit() {
    this.submit.emit();
  }
}
