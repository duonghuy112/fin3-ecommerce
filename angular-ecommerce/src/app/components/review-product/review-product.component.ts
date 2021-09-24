import { Customer } from './../../common/customer';
import { Product } from './../../common/product';
import { CustomerService } from './../../services/customer.service';
import { ProductService } from './../../services/product.service';
import { MyCustomValidators } from './../../validators/my-custom-validators';
import { ErrMessage } from 'src/app/common/validator/err-message';
import { ReviewProductService } from './../../services/review-product.service';
import { Review } from './../../common/review';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-review-product',
  templateUrl: './review-product.component.html',
  styleUrls: ['./review-product.component.css']
})
export class ReviewProductComponent implements OnInit {
  // form group
  reviewFormGroup!: FormGroup;

  // review list by product
  reviews: Review[] =[];
  product!: Product;
  customer!: Customer;

  // message error
  errMessage = ErrMessage;

  // storage
  storage: Storage = sessionStorage;

  constructor(private formBuilder: FormBuilder,
              private reviewService: ReviewProductService,
              private productService: ProductService,
              private customerService: CustomerService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.reviewFormGroup = this.formBuilder.group({
        content: new FormControl('', [Validators.required, Validators.minLength(2), 
                                      Validators.maxLength(255), MyCustomValidators.notOnlyWhitespace,
                                      MyCustomValidators.badwordConstraint])
    });
  
    this.productService.getProduct(this.getProductId()).subscribe(
      data => {
        this.product = data;
      }
    );

    this.customerService.getCustomer('huy@mail.com').subscribe(
      data => {
        this.customer = data;
      }
    );

    this.listReviews();
  }

  get content() {
    return this.reviewFormGroup.get('content');
  }

  getProductId(): number {
    let productId = Number(this.route.snapshot.paramMap.get('id'));;
    return productId;
  }

  listReviews() {
    this.reviewService.getReviews(this.getProductId()).subscribe(
      data => {
        this.reviews = data._embedded.reviews;
      }
    )
  }

  onReviewSubmit() {
    if (this.reviewFormGroup.invalid) {
      this.reviewFormGroup.markAllAsTouched();
      return;
    } 
  
    let review = new Review();
    review.product = this.product;
    review.customer = this.customer;
    review.content = this.reviewFormGroup.get('content')?.value;

    console.log(review);
    
    this.reviewService.addReview(review).subscribe({
      next: response => {
        alert(response);
        this.resetForm();
      },
      error: err => {
        console.log(err);
        alert(`Error: ${err}`);
      }
    });
  }

  resetForm() {
    this.reviewFormGroup.reset();
  }

}
