import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function DecimalValidator(
  maxIntegerDigits: number = 15,
  maxFractionDigits: number = 6,
): ValidatorFn {
  const regex = new RegExp(
    `^\\d{1,${maxIntegerDigits}}(\\.\\d{1,${maxFractionDigits}})?$`,
  );
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === "") {
      return null;
    }

    if (typeof value !== "string" && typeof value !== "number") {
      return { invalidType: true };
    } else {
      return regex.test(typeof value === "number" ? value.toString() : value)
        ? null
        : { invalidDecimalFormat: true };
    }
  };
}