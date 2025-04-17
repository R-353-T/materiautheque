import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IonSpinner, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: "app-input-submit",
  templateUrl: "./input-submit.component.html",
  styleUrls: ["./input-submit.component.scss"],
  imports: [
    CommonModule,
    IonSpinner,
    IonIcon
  ],
  standalone: true,
})
export class InputSubmitComponent {
  @Input()
  loading: boolean = false;

  @Input()
  disabled: boolean = false;

  @Input()
  label: string = "envoyer";

  @Input()
  icon: string = "checkmark";

  @Output()
  submit = new EventEmitter<void>();

  onSubmit() {
    if (this.disabled === false && this.loading === false) {
      this.submit.emit();
    }
  }
}
