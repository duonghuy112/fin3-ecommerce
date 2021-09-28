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

  getOrderHistory(email: string, page: number, pageSize: number): Observable<ResponseOrderHistory> {
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmail?email=${email}&page=${page}&size=${pageSize}&sort=dateCreated,desc`;
    return this.httpClient.get<ResponseOrderHistory>(orderHistoryUrl);
  }

  updateStatusOrder(order: OrderHistory): Observable<OrderHistory> {
    return this.httpClient.put<OrderHistory>(`${this.orderUrl}/${order.id}`, order);
  }

  getOrderItems(orderId: number): Observable<ResponseOrderItem> {
    const orderItemsByOrderIdUrl = `${this.orderItemUrl}/search/findByOrderId?orderId=${orderId}`;
    return this.httpClient.get<ResponseOrderItem>(orderItemsByOrderIdUrl);
  }
}