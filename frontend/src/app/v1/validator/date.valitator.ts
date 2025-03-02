import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function DateValidator(): ValidatorFn {
  const isoRegex = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|([+-]\d{2}:\d{2}))?$/;
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (typeof value !== "string") {
      return { invalidType: true };
    } else {
      return isoRegex.test(value) ? null : { invalidDateFormat: true };
    }
  };
}