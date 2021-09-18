import { OrderItem } from './order-item';
import { Order } from './order';
import { Address } from './address';
import { Customer } from './customer';

export class Purchase {
    customer!: Customer;
    address!: Address;
    order!: Order;
    orderItems!: OrderItem[];
}
