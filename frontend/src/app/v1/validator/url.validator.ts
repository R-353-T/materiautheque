import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function UrlValidator(): ValidatorFn {
  const urlRegex = /^(http|https|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (typeof value !== "string") {
      return { invalidType: true };
    } else {
      return urlRegex.test(value) ? null : { invalidUrl: true };
    }
  };
}