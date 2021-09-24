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

  product!: Product;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private toastr: ToastrService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    })
  }

  handleProductDetails() {
    // get Id param string. convert string to number.
    const productId: number = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProduct(productId).subscribe(
      data => {
        this.product = data;
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
