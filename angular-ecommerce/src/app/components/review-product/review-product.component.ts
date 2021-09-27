import { Customer } from './../../common/customer';
import { CustomerService } from './../../services/customer.service';
import { MyCustomValidators } from './../../validators/my-custom-validators';
import { ErrMessage } from 'src/app/common/validator/err-message';
import { ReviewProductService } from './../../services/review-product.service';
import { Review } from './../../common/review';
import { ActivatedRoute, Router } from '@angular/router';
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
  editReviewFromGroup!: FormGroup;

  // review list by product
  reviews: Review[] = [];
  editReview!: Review;
  customer!: Customer;

  // message error
  errMessage = ErrMessage;

  // storage
  storage: Storage = sessionStorage;

  constructor(private formBuilder: FormBuilder,
              private reviewService: ReviewProductService,
              private customerService: CustomerService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.reviewFormGroup = this.formBuilder.group({
        content: new FormControl('', [Validators.required, Validators.minLength(2), 
                                      Validators.maxLength(255), MyCustomValidators.notOnlyWhitespace,
                                      MyCustomValidators.badwordConstraint])
    });

    this.editReviewFromGroup = this.formBuilder.group({
        editContent: new FormControl('', [Validators.required, Validators.minLength(2), 
                                      Validators.maxLength(255), MyCustomValidators.notOnlyWhitespace,
                                      MyCustomValidators.badwordConstraint])
    });
    
    this.customerService.getCustomer(JSON.parse(this.storage.getItem('userEmail') as string)).subscribe(
      data => {
        this.customer = data;
      }
    );

    this.listReviews();
  }

  get content() {
    return this.reviewFormGroup.get('content');
  }

  get editContent() {
    return this.editReviewFromGroup.get('editContent');
  }

  getProductId(): number {
    let productId = Number(this.route.snapshot.paramMap.get('id'));
    return productId;
  }

  listReviews() {
    this.reviewService.getReviews(this.getProductId()).subscribe(
      data => {
        this.reviews = data;
        console.log(this.reviews);
      }
    )
  }

  onReviewSubmit() {
    if (this.reviewFormGroup.invalid) {
      this.reviewFormGroup.markAllAsTouched();
      return;
    } 
  
    // set up review
    let review = new Review();
    review.content = this.reviewFormGroup.get('content')?.value;
    review.customer = this.customer;
    review.productId = this.getProductId();

    console.log(review);
    
    this.reviewService.addReview(review).subscribe({
      next: response => {
        alert(response);
        this.resetForm();
        this.listReviews();
      },
      error: err => {
        console.log(err);
        alert(`Error: ${err}`);
        this.router.navigateByUrl('/error');
      }
    });
  }

  onEditReviewSubmit() {
    if (this.editReviewFromGroup.invalid) {
      this.editReviewFromGroup.markAllAsTouched();
      return;
    }

    this.editReview.content = this.editReviewFromGroup.get('editContent')?.value;

    console.log(this.editReview);

    this.reviewService.updateReview(this.editReview).subscribe({
      next: response => {
        alert(response);
        this.resetForm();
        this.listReviews();
      },
      error: err => {
        console.log(err);
        alert(`Error: ${err}`);
        this.router.navigateByUrl('/error');
      }
    });
    
  }

  resetForm() {
    this.reviewFormGroup.reset();
  }

  openEditContent(review: Review) {
    console.log(review);
    this.editReviewFromGroup.get('editContent')?.setValue(review.content);
    this.editReview = review;
  }

}
