import { FormControl, ValidationErrors } from '@angular/forms';
export class MyCustomValidators {
    
    // whitespace validators
    static notOnlyWhitespace(control: FormControl): ValidationErrors {
        // check if string only contains whitespace
        if ((control.value != null) && (control.value.trim().length === 0)) {
            // invalid, return erroe object
            return {
                'notOnlyWhitespace': true
            }
        } else {
            // valid, return null
            return null as any;
        }
    }
}
