import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";

@Component({
  selector: "app-input-image",
  templateUrl: "./input-image.component.html",
  styleUrls: ["./input-image.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
  ],
})
export class InputImageComponent implements OnChanges {
  @ViewChild("inputFileC")
  inputFileC?: ElementRef;

  @Input()
  errorText: boolean | string = false;

  @Input()
  infoText: boolean | string = false;

  @Input()
  label: string = "";

  @Input()
  file: File | undefined;
  
  @Output()
  fileChange = new EventEmitter<File | undefined>();

  onUpdate(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.fileChange.emit(input.files[0]);
    } else {
      this.fileChange.emit(undefined);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["file"] && this.file === undefined && this.inputFileC) {
      this.inputFileC.nativeElement.value = "";
    }
  }
}
