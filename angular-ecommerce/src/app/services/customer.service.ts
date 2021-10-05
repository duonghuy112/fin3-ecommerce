import { ResponseCustomer } from './../response/response-customer';
import { Observable } from 'rxjs';
import { Customer } from './../common/customer';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private customerUrl = environment.baseUrl + '/customers';

  storage: Storage = sessionStorage;

  constructor(private httpClient: HttpClient) { }

  getAll(page: number, pageSize: number): Observable<ResponseCustomer> {
    return this.httpClient.get<ResponseCustomer>(`${this.customerUrl}/?page=${page}&size=${pageSize}`);
  }

  getByAdmin(isAdmin: number, page: number, pageSize: number): Observable<ResponseCustomer> {
    return this.httpClient.get<ResponseCustomer>(`${this.customerUrl}/findByAdmin?isAdmin=${isAdmin}&page=${page}&size=${pageSize}`);
  }

  getByName(name: string, page: number, pageSize: number): Observable<ResponseCustomer> {
    return this.httpClient.get<ResponseCustomer>(`${this.customerUrl}/findByName?name=${name}&page=${page}&size=${pageSize}`);
  }

  getCustomer(email: String): Observable<Customer> {
    const customerByEmailUrl = `${this.customerUrl}/findByEmail?email=${email}`;
    return this.httpClient.get<Customer>(customerByEmailUrl);
  }

  add(customer: Customer): Observable<Customer> {
    return this.httpClient.post<Customer>(this.customerUrl, customer);
  }

  update(customer: Customer): Observable<Customer> {
    return this.httpClient.put<Customer>(`${this.customerUrl}/${customer.id}`, customer);
  }

  persistCustomer(customer: Customer) {
    this.storage.setItem('customer', JSON.stringify(customer));
  }

}
