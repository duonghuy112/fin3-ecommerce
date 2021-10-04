import { Category } from './category';
import { Product } from './product';

export class CartItem {

    id: number;
    name: string;
    description: string;
    imageUrl: string;
    unitPrice: number;
    quantity: number;
    category: Category;

    constructor(product: Product) {
        this.id = product.id;
        this.name = product.name;
        this.description = product.description;
        this.imageUrl = product.imageUrl;
        this.unitPrice = product.unitPrice;
        this.quantity = 1;
        this.category = product.category;
    }

}
