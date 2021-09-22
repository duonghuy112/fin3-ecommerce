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

    // badword constraint validators
    static badwordConstraint(control: FormControl): ValidationErrors {
        // define badword
        let badword = ['fuck', 'bitch', 'shit', 'dick', 'asshole', 'damn'];

        // check if string contains badword
        for (let bw of badword) {
            if (control.value.includes(bw)) {
                // invalid, return error object
                return {
                    'badwordConstraint': true
                }
            }               
        }
        // valid, return null
        return null as any;
    }
}
