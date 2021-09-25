import { OrderItem } from './../common/order-item';
export interface ResponseOrderItem {
  _embedded: {
    orderItems: OrderItem[];
  }
}