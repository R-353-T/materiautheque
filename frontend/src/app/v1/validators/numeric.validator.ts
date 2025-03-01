import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function NumericValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
  
      if (typeof value !== "string") {
        return { invalidType: true };
      } else {
        const parsed = Number(value);
        return !isNaN(parsed) ? null : { invalidNumber: true };
      }
    };
  }