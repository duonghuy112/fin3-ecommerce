import { MyCustomValidators } from './../../validators/my-custom-validators';
import { City } from './../../common/city';
import { Country } from './../../common/country';
import { FormServiceService } from '../../services/form-service.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  // form group
  checkoutFormGroup!: FormGroup;

  // cart
  totalQuantity: number = 0;
  totalPrice: number = 0;

  // shipping
  countries:  Country[] = [];
  cities: City[] = [];

  // Credit Card
  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  constructor(private formBuilder: FormBuilder,
              private formService: FormServiceService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, 
                                        Validators.minLength(2), 
                                        MyCustomValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, 
                                      Validators.minLength(2),
                                      MyCustomValidators.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, 
                                    Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        country: [''],
        city: [''],
        district: [''],
        zipCode: [''],
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        cardName: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    // populate countries on shipping address
    this.formService.getCountry().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    )

    // populate credit card month
    const startMonth: number = new Date().getMonth() + 1;
    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // populate credit card year
    this.formService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );
  }

  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(this.checkoutFormGroup.get('shippingAddress')?.value);
  }

  // handle month by year
  handleMonthsAnsYears() {
    const creditCartFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCartFormGroup?.value.expirationYear);
    let startMonth: number = 1;

    // if currentYear equals selectedYear
    // then month start with current month
    // else month start with 1
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  // get city by country code
  getCity() {
    const formGroup = this.checkoutFormGroup.get("shippingAddress");
    const countryCode = formGroup?.value.country.code;
    console.log(`Country code: ${countryCode}`);

    this.formService.getCity(countryCode).subscribe(
      data => {
        console.log("Retrieved cities: " + JSON.stringify(data));
        this.cities = data;
        formGroup?.get('city')?.setValue(data[0]);
      }
    );
  }
}
