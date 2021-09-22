import { OrderItem } from './order-item';
import { Customer } from './customer';
import { Address } from './address';
export class OrderHistory {
    id!: number;
    orderTrackingNumber!: string;
    totalPrice!: number;
    totalQuantity!: number;
    dateCreated!: Date;
    address!: Address;
    customer!: Customer;
    orderItem!: OrderItem;
}
