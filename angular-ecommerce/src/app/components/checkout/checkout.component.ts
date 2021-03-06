import { Customer } from './../../common/customer';
import { ToastrService } from 'ngx-toastr';
import { Purchase } from './../../common/purchase';
import { OrderItem } from './../../common/order-item';
import { Order } from './../../common/order';
import { Router } from '@angular/router';
import { CheckoutService } from './../../services/checkout.service';
import { CartService } from './../../services/cart.service';
import { MyCustomValidators } from './../../validators/my-custom-validators';
import { City } from './../../common/city';
import { Country } from './../../common/country';
import { FormServiceService } from '../../services/form-service.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrMessage } from 'src/app/common/validator/err-message';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  @ViewChild('input') input!: ElementRef;

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

  // store session
  store: Storage = sessionStorage;

  // validation message
  errMessage = ErrMessage;

  constructor(private formBuilder: FormBuilder,
              private formService: FormServiceService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl(JSON.parse(this.store.getItem('customer') as string).firstName, [Validators.required, 
                                        Validators.minLength(2),
                                        Validators.maxLength(255), 
                                        MyCustomValidators.notOnlyWhitespace]),
        lastName: new FormControl(JSON.parse(this.store.getItem('customer') as string).lastName, [Validators.required, 
                                      Validators.minLength(2),
                                      Validators.maxLength(255),
                                      MyCustomValidators.notOnlyWhitespace]),
        email: new FormControl(JSON.parse(this.store.getItem('userEmail') as string), [Validators.required,
                                    Validators.maxLength(255), 
                                    Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        district: new FormControl('', [Validators.minLength(2),
                                      Validators.maxLength(255)]),
        street: new FormControl('', [Validators.required, 
                                    Validators.minLength(2),
                                    Validators.maxLength(255), 
                                    MyCustomValidators.notOnlyWhitespace]),
        zipCode: new FormControl('', [Validators.minLength(2),
                                      Validators.maxLength(255)])
      }),
    });

    // cart details
    this.reviewCartDetails();

    // populate countries on shipping address
    this.formService.getCountry().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );

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

  // getter for custommer
  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  // getter for shippingAddress
  get country() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  get city() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  get district() {
    return this.checkoutFormGroup.get('shippingAddress.district');
  }

  get street() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }

  get zipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  // on submit method
  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(this.checkoutFormGroup.get('shippingAddress')?.value);

    // set up order 
    let order = new Order();
    order.totalQuantity = this.totalQuantity;
    order.totalPrice = this.totalPrice;
    order.status = Number(1);

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create order items from cart items
    let orderItems: OrderItem[] = cartItems.map(cartItem => new OrderItem(cartItem));

    // set up purchase
    let purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase - shipping address
    purchase.address = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.address.country));
    const shippingCity: City = JSON.parse(JSON.stringify(purchase.address.city));
    purchase.address.country = shippingCountry.name;
    purchase.address.city = shippingCity.name;

    // populate purchase - order & order items
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call Checkout Service
    this.checkoutService.placeOrder(purchase).subscribe({
      next: response => {
        this.toastr.success(`Order tracking number: ${response.orderTrackingNumber}`, 'Your purchase successfully!');
        // reset cart
        this.resetCart();
      },
      error: err => {
        console.log(err);
        this.toastr.error("Error response");
        this.router.navigateByUrl('/error');
      }
    })
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

  reviewCartDetails() {
    // subscribe to totalQuanity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    // subscribe to totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
  }

  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset form
    this.checkoutFormGroup.reset();

    // back to products list
    this.router.navigateByUrl('/products');
  }

  // tab loop circle
  onKey(event: any) {
    if (event.key === 'Tab') {
      this.input.nativeElement.focus();
    }
  }
}