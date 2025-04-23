import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormInput } from 'src/app/classes/form-input';
import { InputWrapperComponent } from '../input-wrapper/input-wrapper.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-input-image',
  templateUrl: './input-image.component.html',
  styleUrls: ['./input-image.component.scss'],
  standalone: true,
  imports: [
    InputWrapperComponent,
    CommonModule
  ]
})
export class InputImageComponent implements OnInit, OnDestroy {
  @ViewChild('imageInput')
  imageInput!: ElementRef<HTMLInputElement>;

  @Input({ required: true })
  input!: FormInput;

  previewUrl: string | ArrayBuffer | null = null;

  private _controlSubscription?: Subscription;

  ngOnInit(): void {
    this._controlSubscription = this.input.control.valueChanges.subscribe((value) => {
      if(value === null) {
        this.previewUrl = null;
        this.imageInput.nativeElement.value = '';
      }
    });
  }

  ngOnDestroy(): void {
    this._controlSubscription?.unsubscribe();
  }

  onChange(event: Event) {
    this.input.control.markAsDirty();

    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
        const file = input.files[0];
        this.input.control.setValue(file);

        const reader = new FileReader();
        reader.onload = () => {
            this.previewUrl = reader.result;
        }
        reader.readAsDataURL(file);
    } else {
        this.input.control.setValue(null);
    }
  }
}
