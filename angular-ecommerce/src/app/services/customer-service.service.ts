import { Customer } from './../common/customer';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerServiceService {

  private customerUrl = environment.baseUrl + '/customers';

  constructor(private httpClient: HttpClient) { }

  getCustomer(email: string): Observable<Customer> {
    const customerByEmailUrl = `${this.customerUrl}/search/findByEmail?email=${email}`;
    return this.httpClient.get<Customer>(customerByEmailUrl);
  }
}
