import { ResponseOrderHistory } from './../response/response-order-history';
import { OrderHistory } from './../common/order-history';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl = 'http://localhost:8999/api/orders';

  constructor(private httpClient: HttpClient) { }

  getOrderHistory(email: string): Observable<ResponseOrderHistory> {
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmail?email=${email}`;
    return this.httpClient.get<ResponseOrderHistory>(orderHistoryUrl);
  }
}