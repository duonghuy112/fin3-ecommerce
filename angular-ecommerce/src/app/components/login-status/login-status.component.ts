import { OktaAuthService } from '@okta/okta-angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: string | undefined;

  constructor(private oktaAuthService: OktaAuthService) { }

  ngOnInit(): void {
    this.oktaAuthService.$authenticationState.subscribe(
      (result) => {
        this.isAuthenticated = result;
      }
    )
  }

  getUserDetails() {
    if (this.isAuthenticated) {
      // fetch the logged in user details
      // user fullname is exposed as a property name
      this.oktaAuthService.getUser().then(
        (result) => {
          this.userFullName = result.name;
        }
      )
    }
  }

  logout() {
    // terminates the session with Okta and remove current tokens
    this.oktaAuthService.signOut();
  }

}
