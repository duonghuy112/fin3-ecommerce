import { ReviewProductService } from './../../services/review-product.service';
import { CartItem } from './../../common/cart-item';
import { CartService } from './../../services/cart.service';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from './../../services/product.service';
import { Product } from './../../common/product';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  // product
  product = new Product();

  starReview! : number;

  constructor(private productService: ProductService,
              private reviewService: ReviewProductService,
              private cartService: CartService,
              private toastr: ToastrService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
    this.handleStarReview();
  }

  handleProductDetails() {
    // get Id param string. convert string to number.
    const productId: number = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(productId).subscribe(
      data => {
        this.product = data;
      }
    )
  }

  handleStarReview() {
    this.reviewService.getStarReview(Number(this.route.snapshot.paramMap.get('id'))).subscribe(
      data => {
        this.starReview = data;
        if (this.starReview > 0 && this.starReview <= 1.2) {
          this.starReview = 1
        } else if (this.starReview > 1.2 && this.starReview <= 1.7) {
          this.starReview = 1.5
        } else if (this.starReview > 1.7 && this.starReview <= 2.2) {
          this.starReview = 2
        } else if (this.starReview > 2.2 && this.starReview <= 2.7) {
          this.starReview = 2.5
        } else if (this.starReview > 2.7 && this.starReview <= 3.2) {
          this.starReview = 3
        } else if (this.starReview > 3.2 && this.starReview <= 3.7) {
          this.starReview = 3.5
        } else if (this.starReview > 3.7 && this.starReview <= 4.2) {
          this.starReview = 4
        } else if (this.starReview > 4.2 && this.starReview <= 4.7) {
          this.starReview = 4.5
        } else if (this.starReview > 4.7 && this.starReview <= 5) {
          this.starReview = 5
        }
        console.log('star: ' + this.starReview);
      }
    )
  }

  addToCart() {
    const cartItem: CartItem = new CartItem(this.product);
    this.cartService.addToCart(cartItem);

    // add toastr
    this.toastr.success(`Cart has been updated!`, "Add to cart successfully");
    
    console.log(`Adding to cart: ${this.product.name}, ${this.product.unitPrice}`)
  }

}
