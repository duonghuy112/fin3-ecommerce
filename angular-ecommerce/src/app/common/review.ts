import { Customer } from './customer';
import { Product } from './product';
export class Review {
    product!: Product;
    customer!: Customer;
    content!: string;
    dateCreated!: Date;
}
