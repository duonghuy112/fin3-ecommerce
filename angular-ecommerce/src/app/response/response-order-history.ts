import { OrderHistory } from './../common/order-history';
export interface ResponseOrderHistory {
    content: OrderHistory[];
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
}