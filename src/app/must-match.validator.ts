import { FormGroup } from '@angular/forms';

/**
 * Función para comprobar si los 2 strings pasados como parámetros son idénticos/coinciden
 * @param controlName 
 * @param matchingControlName 
 */
export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // Hace return si la validación NO falla
            return;
        }

        // Setea error si la validación falla
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}