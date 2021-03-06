import { CartItem } from './../common/cart-item';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  storage: Storage = sessionStorage; // reference to web browser's session
  // another option: user localStorage to save in cache

  constructor() {
    // read data from storage
    if (this.storage.getItem('cartItems')) {
      this.cartItems = JSON.parse(this.storage.getItem('cartItems') as string);
      // compute totals based on data
      this.computeCartTotals();
    }
   } 

  addToCart(cartItem: CartItem) {

    // check if already have the item in cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined!;

    if (this.cartItems.length > 0) {

      // find the item in the cart based on item id
      existingCartItem = this.cartItems.find(tmpCartItem => tmpCartItem.id === cartItem.id)!;

      // check if found it
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if (alreadyExistsInCart) {
      // increment the quantity
      existingCartItem.quantity++;
    }
    else {
      // just add the item to the cart array
      this.cartItems.push(cartItem);
    }

    // compute cart total price and total quantity
    this.computeCartTotals();
  }

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;

    if (cartItem.quantity == 0) {
      this.remove(cartItem);
    } else {
      this.computeCartTotals();
    }
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let curCartItem of this.cartItems) {
      totalPriceValue += curCartItem.quantity * curCartItem.unitPrice;
      totalQuantityValue += curCartItem.quantity;
    }

    // publish the new values ... all subscribers will receive the new data
    this.totalPrice.next(Number(totalPriceValue.toFixed(2)));
    this.totalQuantity.next(totalQuantityValue);

    // persist cart data -> save to browser's session
    this.persistCartItem();

    // log cart data just for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  remove(cartItem: CartItem) {
    // get index of item from cart array
    // then remove it
    this.cartItems.forEach((tmpCartItem, index) => {
      if (tmpCartItem.id === cartItem.id) {
        this.cartItems.splice(index, 1);
      }
    })
    this.computeCartTotals();
  }

  persistCartItem() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems)); // convert object to string
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {

    console.log('Contents of the cart');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
  }
}
