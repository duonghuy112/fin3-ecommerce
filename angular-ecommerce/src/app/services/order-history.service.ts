import { OrderHistory } from './../common/order-history';
import { ResponseOrderItem } from './../response/response-order-item';
import { ResponseOrderHistory } from './../response/response-order-history';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl = environment.baseUrl + '/orders';
  private orderItemUrl = environment.baseUrl + '/orderItems';

  constructor(private httpClient: HttpClient) { }

  getAllOrderHistory(page: number, pageSize: number): Observable<ResponseOrderHistory> {
    return this.httpClient.get<ResponseOrderHistory>(`${this.orderUrl}?page=${page}&size=${pageSize}`);
  }

  getOrderHistoryByEmail(email: string, page: number, pageSize: number): Observable<ResponseOrderHistory> {
    const orderHistoryUrl = `${this.orderUrl}/findByCustomerEmail?email=${email}&page=${page}&size=${pageSize}`;
    return this.httpClient.get<ResponseOrderHistory>(orderHistoryUrl);
  }

  getOrderHistoryByStatus(status: number, page: number, pageSize: number): Observable<ResponseOrderHistory> {
    const orderHistoryUrl = `${this.orderUrl}/findByStatus?status=${status}&page=${page}&size=${pageSize}`;
    return this.httpClient.get<ResponseOrderHistory>(orderHistoryUrl);
  }

  getOrderHistoryByOrderTrackingNumber(orderTrackingNumber: string, page: number, pageSize: number): Observable<ResponseOrderHistory> {
    const orderHistoryUrl = `${this.orderUrl}/findByOrderTrackingNumber?orderTrackingNumber=${orderTrackingNumber}&page=${page}&size=${pageSize}`;
    return this.httpClient.get<ResponseOrderHistory>(orderHistoryUrl);
  }

  updateStatusOrder(order: OrderHistory): Observable<OrderHistory> {
    return this.httpClient.put<OrderHistory>(`${this.orderUrl}/${order.id}`, order);
  }

  getOrderHistory(orderId: number): Observable<OrderHistory> {
    return this.httpClient.get<OrderHistory>(`${this.orderUrl}/findById?id=${orderId}`);
  }

  getOrderItems(orderId: number): Observable<ResponseOrderItem> {
    const orderItemsByOrderIdUrl = `${this.orderItemUrl}/search/findByOrderId?orderId=${orderId}`;
    return this.httpClient.get<ResponseOrderItem>(orderItemsByOrderIdUrl);
  }
}