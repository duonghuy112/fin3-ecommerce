import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Customer } from './../../common/customer';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from './../../services/customer.service';
import { MyCustomValidators } from './../../validators/my-custom-validators';
import { ErrMessage } from 'src/app/common/validator/err-message';
import { ReviewProductService } from './../../services/review-product.service';
import { Review } from './../../common/review';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-review-product',
  templateUrl: './review-product.component.html',
  styleUrls: ['./review-product.component.css']
})
export class ReviewProductComponent implements OnInit {

  @ViewChild('input') input!: ElementRef;

  // form group
  reviewFormGroup!: FormGroup;
  editReviewFromGroup!: FormGroup;

  // review list by product
  reviews: Review[] = [];
  editReview!: Review;
  deleteReview!: Review;
  starReview: number = 0;

  // cusotmer
  customer = new Customer();

  // check login 
  isAuthenticated!: string;

  // message error
  errMessage = ErrMessage;

  // storage
  storage: Storage = sessionStorage;

  // email
  email!: string;

  // page
  pageNumber: number = 1;
  pageSize: number = 3;
  totalElements: number = 0;
  startElement: number = 0;
  endElement: number = 0;
  inputPage = new FormControl();

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
        star: new FormControl(5, Validators.required),
        content: new FormControl('', [Validators.required, Validators.minLength(2), 
                                      Validators.maxLength(255), MyCustomValidators.notOnlyWhitespace,
                                      MyCustomValidators.badwordConstraint])
    });

    this.editReviewFromGroup = this.formBuilder.group({
        editStar: new FormControl('', Validators.required),
        editContent: new FormControl('', [Validators.required, Validators.minLength(2), 
                                      Validators.maxLength(255), MyCustomValidators.notOnlyWhitespace,
                                      MyCustomValidators.badwordConstraint])
    });
    
    this.email = JSON.parse(this.storage.getItem('userEmail') as string);

    this.listReviews();

    if (this.isAuthenticated) {
      this.customerService.getCustomer(this.email).subscribe(
        data => {
          this.customer = data;
        }
      );
    }
  }

  get star() {
    return this.reviewFormGroup.get('star');
  }
  get content() {
    return this.reviewFormGroup.get('content');
  }

  get editStar() {
    return this.editReviewFromGroup.get('editStar');
  }

  get editContent() {
    return this.editReviewFromGroup.get('editContent');
  }

  getProductId(): number {
    let productId = Number(this.route.snapshot.paramMap.get('id'));
    return productId;
  }

  listReviews() {
    this.reviewService.getReviews(this.getProductId(), this.pageNumber - 1, this.pageSize).subscribe(this.processResult());
  }

  onReviewSubmit() {
    if (this.reviewFormGroup.invalid) {
      this.reviewFormGroup.markAllAsTouched();
      return;
    }
    
    // set up review
    let review = new Review();
    review.star = this.reviewFormGroup.get('star')?.value;
    review.content = this.reviewFormGroup.get('content')?.value;
    review.productId = this.getProductId();
    review.customer = this.customer;
    review.isDeleted = 0;

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
    
    this.editReview.star = this.editReviewFromGroup.get('editStar')?.value;
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
  
  processResult() {
    return data => {
        this.reviews = data.content;
        this.pageNumber = data.number + 1;
        this.pageSize = data.size;
        this.totalElements = data.totalElements;
        this.startElement = (this.pageNumber - 1) * this.pageSize + 1;
        this.endElement = this.startElement + this.pageSize - 1;
        if (this.endElement > this.totalElements) {
          this.endElement = this.totalElements
        }
    };
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listReviews();
  }

  goToPage() {
    this.inputPage.setValidators([Validators.pattern('[0-9]{1,2}'), Validators.min(1), Validators.max(this.totalElements / this.pageSize + 1)]);
    
    if(this.inputPage.invalid) {
      this.inputPage.setValue(1);
      return;
    }

    this.inputPage.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe(
      value => {
        this.pageNumber = value;
      }
    )
  }
  
  openEditContent(review: Review) {
    this.editReview = review;
    this.reviewService.get(this.editReview.id).subscribe(
      data => {
        if (data === null) {
          // review has been deleted
          document.getElementById('edit-close-form')?.click();
          Swal.fire({
            title: 'Review has been deleted!',
            text: 'Do you want to reload page?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, reload page!',
            cancelButtonText: 'No, keep it'
          }).then(
            result => {
              if (result.value) {
                document.getElementById('edit-close-form')?.click();
                this.listReviews();
              } else {
                document.getElementById('edit-close-form')?.click();
              }
            }
          )
        } else if (JSON.stringify(this.editReview) === JSON.stringify(data)) {
          // review can edit
          this.editReviewFromGroup.patchValue({
            editStar: review.star,
            editContent: review.content
          })
          console.log(JSON.stringify(this.editStar) + ' - ' + JSON.stringify(this.editContent));
          this.onEditReviewSubmit();
        } else {
          // review has been updated
          document.getElementById('edit-close-form')?.click();
          Swal.fire({
            title: 'Review has been updated!',
            text: 'Do you want to reload page?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, reload page!',
            cancelButtonText: 'No, keep it',
          }).then(
            result => {
              if (result.value) {
                document.getElementById('edit-close-form')?.click();
                this.listReviews();
              } else {
                document.getElementById('edit-close-form')?.click();
              }
            }
          )
        }
      }
    )
  }
  
  openDelete(review: Review) {
    this.deleteReview = review;
    Swal.fire({
      title: 'Delete review',
      text: 'Do you want to delete your review?!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then(
      result => {
        if (result.value) {
          this.deleteReviewConfirm();
        } 
      }
    )
  }

  deleteReviewConfirm() {
    this.reviewService.get(this.deleteReview.id).subscribe(
      data => {
        if (data === null) {
          // review has been deleted
          Swal.fire({
            title: 'Review has been deleted!',
            text: 'Do you want to reload page?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, reload page!',
            cancelButtonText: 'No, keep it'
          }).then(
            result => {
              if (result.value) {
                this.listReviews();
              }
            }
          )
        } else if (JSON.stringify(this.deleteReview) === JSON.stringify(data)) {
          // review can delete
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
        } else {
          // review has been updated
          Swal.fire({
            title: 'Review has been updated!',
            text: 'Do you want to reload page?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, reload page!',
            cancelButtonText: 'No, keep it'
          }).then(
            result => {
              if (result.value) {
                this.listReviews();
              }
            }
          )
        }
      }
    )
  }

  resetForm() {
    this.reviewFormGroup.reset();
    this.editReviewFromGroup.reset();
  }

  onKey(event: any) {
    if (event.key === 'Tab') {
      this.input.nativeElement.focus();
    }
  }
}
