import { Customer } from './customer';
export class Review {
    id!: number;
    content!: string;
    productId!: number;
    customer!: Customer;
    dateCreated!: Date;
    lastUpdated!: Date;
    isDeleted!: number;
    star!: number;
}
