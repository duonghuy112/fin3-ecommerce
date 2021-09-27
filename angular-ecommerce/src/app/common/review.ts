import { Customer } from './customer';
export class Review {
    id!: string;
    content!: string;
    productId!: number;
    customer!: Customer;
    dateCreated!: Date;
}
