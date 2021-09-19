import { OrderItem } from './order-item';
export class OrderHistory {
    id!: number;
    orderTrackingNumber!: string;
    totalPrice!: number;
    totalQuantity!: number;
    dateCreated!: Date;
}
