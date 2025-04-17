import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class AdvancedValidators {
    static boolean(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            return typeof control.value === "boolean"
                ? null
                : { incorrectBoolean: true };
        };
    }

    static url() {
        const urlRegex = /^(http|https|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (typeof value !== "string") {
                return { incorrectString: true };
            } else {
                return urlRegex.test(value) ? null : { incorrectUrl: true };
            }
        };
    }

    static numeric(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;

            if (typeof value !== "string") {
                return { incorrectType: true };
            } else {
                const parsed = Number(value);
                return !isNaN(parsed) ? null : { incorrectNumber: true };
            }
        };
    }

    static decimal(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;

            if (typeof value !== "string") {
                return { incorrectType: true };
            } else {
                const parsed = Number(value);
                return !isNaN(parsed) ? null : { incorrectNumber: true };
            }
        };
    }
}
