import { CustomerService } from './../../services/customer.service';
import { Customer } from './../../common/customer';
import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: string | undefined;

  storage: Storage = sessionStorage;

  constructor(private oktaAuthService: OktaAuthService,
              private customerService: CustomerService) { }

  ngOnInit(): void {
    // Subscribe to authentication state changes
    this.oktaAuthService.$authenticationState.subscribe(
      (result) => {
        this.isAuthenticated = result;
        this.getUserDetails();
      }
    );
  }

  getUserDetails() {
    if (this.isAuthenticated) {

      // Fetch the logged in user details (user's claims)
      // user full name is exposed as a property name
      this.oktaAuthService.getUser().then(
        (result) => {
          // retrieve the user's name
          this.userFullName = result.name;

          // retrieve the user's email
          const email = result.email;

          // store user name & email to local storage
          this.saveToSession(email);
        }
      );
    }
  }

  saveToSession(email: string | undefined) {
    this.storage.setItem('userName', JSON.stringify(this.userFullName));
    this.storage.setItem('userEmail', JSON.stringify(email));
    this.storage.setItem('isLogin', JSON.stringify(this.isAuthenticated)); 

    let customer = new Customer();
    this.customerService.getCustomer(email as string)?.subscribe(
      data => {
        customer = data;
        this.storage.setItem('customer', JSON.stringify(customer));
        this.storage.setItem('admin', JSON.stringify(customer.isAdmin));
      }
    )
  }

  logout() {
    // Terminates the session with Okta and removes current tokens.
    this.storage.removeItem('isLogin');
    this.storage.removeItem('admin');
    this.storage.removeItem('userName');
    this.storage.removeItem('userEmail');
    this.storage.removeItem('customer');
    this.oktaAuthService.signOut();
  }
}
