import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function BooleanValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return typeof control.value === "boolean" ? null : { invalidBoolean: true };
  };
}