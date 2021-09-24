import { CartItem } from './cart-item';
export class OrderItem {
    name: string;
    imageUrl: string;
    unitPrice: number;
    quantity: number;
    productId: number;

    constructor(cartItem: CartItem) {
        this.name = cartItem.name;
        this.imageUrl = cartItem.imageUrl;
        this.quantity = cartItem.quantity;
        this.unitPrice = cartItem.unitPrice;
        this.productId = cartItem.id;
    }
}
