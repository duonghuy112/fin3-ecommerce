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

  getAll(): Observable<Customer[]> {
    return this.httpClient.get<Customer[]>(this.customerUrl);
  }

  getCustomer(email: String): Observable<Customer> {
    const customerByEmailUrl = `${this.customerUrl}/findByEmail?email=${email}`;
    return this.httpClient.get<Customer>(customerByEmailUrl);
  }

  update(customer: Customer) {
    return this.httpClient.put<Customer>(`${this.customerUrl}/${customer.id}`, customer);
  }

  persistCustomer(customer: Customer) {
    this.storage.setItem('customer', JSON.stringify(customer));
  }

}
