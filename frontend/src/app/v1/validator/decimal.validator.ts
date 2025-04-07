import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function DecimalValidator(
  maxIntegerDigits: number = 15,
  maxFractionDigits: number = 6,
): ValidatorFn {
  const regex = new RegExp(`^\\d{1,${maxIntegerDigits}}(\\.\\d{1,${maxFractionDigits}})?$`);

  return (control: AbstractControl): ValidationErrors | null => {
    
    if(typeof control.value === "number" &&
      control.value.toString().includes(".") &&
      control.value.toString().split(".")[1].length > maxFractionDigits
    ) {
      console.log(control.value.toString().split(".")[1]);  
      return { invalidDecimalFormat: true };
    } else if(typeof control.value === "string") {
      const letters = control.value.split("");
      let dotted = false;
      let fix = 0;

      for (let index = 0; index < letters.length; index++) {
        if(isNaN(Number.parseFloat(letters[index])) && letters[index] !== ".") {
          return { invalidDecimalFormat: true };
        }

        if(dotted) {
          fix++;

          if(fix > maxFractionDigits) {
            return { invalidDecimalFormat: true };
          }
        }

        if(letters[index] === ".") {
          dotted = true;
        }
      }

      return null;
    } else {
      
      return null;
    }
  };
}