import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleAdminGuard implements CanActivate {
  
  storage: Storage = sessionStorage;
  isAdmin!: string;

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.isAdmin = JSON.parse(this.storage.getItem('admin') as string) === 1 ? 'Admin' : 'Customer';
      const isAuthorized = this.isAdmin === route.data.role;
      console.log('Authorize: ' + isAuthorized)
      if (!isAuthorized) {
        this.router.navigateByUrl('/products');
      }
    return isAuthorized;
  }
  
}
