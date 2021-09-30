import { Customer } from './../../common/customer';
import { ToastrService } from 'ngx-toastr';
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
  deleteReview!: Review;

  // cusotmer
  customer!: Customer;

  // check login 
  isAuthenticated!: string;

  // message error
  errMessage = ErrMessage;

  // storage
  storage: Storage = sessionStorage;

  // email
  email!: string;

  constructor(private formBuilder: FormBuilder,
              private reviewService: ReviewProductService,
              private customerService: CustomerService,
              private route: ActivatedRoute,
              private router: Router,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.isAuthenticated = this.storage.getItem('isLogin') as string;
    
    console.log(this.isAuthenticated);

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
    
    this.email = JSON.parse(this.storage.getItem('userEmail') as string);

    this.listReviews();

    this.customerService.getCustomer(this.email).subscribe(
      data => {
        this.customer = data;
      }
    );
  }

  get firstName() {
    return this.reviewFormGroup.get('firstName');
  }

  get lastName() {
    return this.reviewFormGroup.get('lastName');
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
    review.productId = this.getProductId();
    review.customer = this.customer;

    this.reviewService.addReview(review).subscribe({
      next: response => {
        this.toastr.success('Your review has been public', 'Submit review successfully!');
        this.resetForm();
        this.listReviews();
      },
      error: err => {
        console.log(err);
        this.toastr.error("Error response");
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

    document.getElementById('edit-close-form')?.click();
    this.reviewService.updateReview(this.editReview).subscribe({
      next: response => {
        this.toastr.success('Your review has been public', 'Edit review successfully!');
        this.resetForm();
        this.listReviews();
      },
      error: err => {
        console.log(err);
        this.toastr.error("Error response");
        this.router.navigateByUrl('/error');
      }
    }); 
  }

  resetForm() {
    this.reviewFormGroup.reset();
    this.editReviewFromGroup.reset();
  }

  openEditContent(review: Review) {
    console.log("edit " +review);
    this.editReviewFromGroup.get('editContent')?.setValue(review.content);
    this.editReview = review;
  }

  openDeleteModal(review: Review) {
    console.log(`ok ${review}`);
    this.deleteReview = review;
    console.log(`delete ${this.deleteReview}`);
  }

  deleteReviewConfirm() {
    this.deleteReview.isDeleted = 1;
    console.log(this.deleteReview);
    
    this.reviewService.updateReview(this.deleteReview).subscribe({
      next: response => {
        this.toastr.success('Your review has been deleted', 'Delete review successfully!');
        this.resetForm();
        this.listReviews();
      },
      error: err => {
        console.log(err);
        this.toastr.error("Error response");
        this.router.navigateByUrl('/error');
      }
    });
  }
}
