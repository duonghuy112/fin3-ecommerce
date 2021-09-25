import { OrderHistory } from './../common/order-history';
export interface ResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[];
  }
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}