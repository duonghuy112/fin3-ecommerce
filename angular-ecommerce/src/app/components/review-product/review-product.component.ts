import { Customer } from './../../common/customer';
import { Product } from './../../common/product';
import { CustomerServiceService } from './../../services/customer-service.service';
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

  // message error
  errMessage = ErrMessage;

  // storage
  storage: Storage = sessionStorage;

  constructor(private formBuilder: FormBuilder,
              private reviewService: ReviewProductService,
              private productService: ProductService,
              private customerService: CustomerServiceService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.reviewFormGroup = this.formBuilder.group({
      review: this.formBuilder.group({
        content: new FormControl('', [Validators.required, Validators.minLength(2), 
                                      Validators.maxLength(255), MyCustomValidators.notOnlyWhitespace,
                                      MyCustomValidators.badwordConstraint])
      })
    });
  
    this.listReviews();
  }

  get content() {
    return this.reviewFormGroup.get('review.content');
  }

  getProductId(): number {
    let productId = Number(this.route.snapshot.paramMap.get('id'));;
    console.log(productId);
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
    }
    
  }

}
