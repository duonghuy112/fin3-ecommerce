import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[focusInvalid]'
})
export class FocusInvalidDirective {

  constructor(private el: ElementRef) {}

  @HostListener('submit')
  onFormSubmit() {
    const invalidControl = this.el.nativeElement.querySelector('.ng-invalid');
    console.log(invalidControl);

    if (invalidControl) {
      invalidControl.focus();
    }
  }

}
