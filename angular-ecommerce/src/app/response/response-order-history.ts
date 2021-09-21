import { OrderHistory } from './../common/order-history';
export interface ResponseOrderHistory {
    _embedded: {
        orders: OrderHistory[];
      }
}
