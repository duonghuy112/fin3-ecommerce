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

  productId!: number;

  constructor(private formBuilder: FormBuilder,
              private reviewService: ReviewProductService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.reviewFormGroup = this.formBuilder.group({
      review: this.formBuilder.group({
        fullName: new FormControl('', [Validators.required]),
        content: new FormControl('', Validators.required)
      })
    });
    
    this.getProductId();
    this.listReviews();
  }

  get fullName() {
    return this.reviewFormGroup.get('review.fullName')
  }

  get Content() {
    return this.reviewFormGroup.get('review.content')
  }

  getProductId() {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    console.log(this.productId);
  }

  listReviews() {
    this.reviewService.getReviews(this.productId).subscribe(
      data => {
        this.reviews = data;
      }
    )
    console.log(this.reviews);
  }

}
