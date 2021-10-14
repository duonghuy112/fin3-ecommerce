import { RoleAdminGuard } from './authorization/role-admin.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { ProductService } from './services/product.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { Routes, RouterModule, Router } from '@angular/router';
import { NgxSpinnerModule } from "ngx-spinner";
import { CategoryMenuComponent } from './components/category-menu/category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';
import { OKTA_CONFIG, OktaAuthModule, OktaCallbackComponent, OktaAuthGuard } from '@okta/okta-angular';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { ReviewProductComponent } from './components/review-product/review-product.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { ToastrModule } from 'ngx-toastr';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { AutoFocusDirective } from './common/focus/auto-focus.directive';
import { FocusInvalidDirective } from './common/focus/focus-invalid.directive';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminUserComponent } from './components/admin-user/admin-user.component';
import { AdminProductComponent } from './components/admin-product/admin-product.component';
import { AdminOrderComponent } from './components/admin-order/admin-order.component';
import { AdminCategoryComponent } from './components/admin-category/admin-category.component';
import { CategoryEditComponent } from './components/admin-category/category-edit/category-edit.component';
import { CategoryAddComponent } from './components/admin-category/category-add/category-add.component';
import { ProductAddComponent } from './components/admin-product/product-add/product-add.component';
import { ProductEditComponent } from './components/admin-product/product-edit/product-edit.component';
import myAppConfig from './config/my-app-config';

const oktaConfig = Object.assign({
  onAuthRequired: (oktaAuth, injector) => {
    const router = injector.get(Router);
    // redirect user to login page
    router.navigate(['/login']);
  }
}, myAppConfig.oidc);

const routes: Routes = [
  { path: 'admin-category/add', component: CategoryAddComponent }, //, canActivate: [ OktaAuthGuard, RoleAdminGuard ], data: { role: 'Admin' }    
  { path: 'admin-category/:id', component: CategoryEditComponent }, //, canActivate: [ OktaAuthGuard, RoleAdminGuard ], data: { role: 'Admin' }    
  { path: 'admin-category', component: AdminCategoryComponent }, //, canActivate: [ OktaAuthGuard, RoleAdminGuard ], data: { role: 'Admin' }  
  { path: 'admin-product/add', component: ProductAddComponent }, //, canActivate: [ OktaAuthGuard, RoleAdminGuard ], data: { role: 'Admin' }    
  { path: 'admin-product/:id', component: ProductEditComponent }, //, canActivate: [ OktaAuthGuard, RoleAdminGuard ], data: { role: 'Admin' }    
  { path: 'admin-product', component: AdminProductComponent }, //, canActivate: [ OktaAuthGuard, RoleAdminGuard ], data: { role: 'Admin' }    
  { path: 'admin-user', component: AdminUserComponent }, //, canActivate: [ OktaAuthGuard, RoleAdminGuard ], data: { role: 'Admin' }    
  { path: 'admin-order', component: AdminOrderComponent }, //, canActivate: [ OktaAuthGuard, RoleAdminGuard ], data: { role: 'Admin' }    
  { path: 'my-profile', component: ProfileComponent, canActivate: [ OktaAuthGuard ]  }, 
  { path: 'order-history', component: OrderHistoryComponent, canActivate: [ OktaAuthGuard ]  }, 
  { path: 'login/callback', component: OktaCallbackComponent },
  { path: 'login', component: LoginComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [ OktaAuthGuard ]  }, 
  { path: 'cart-details', component: CartDetailsComponent, canActivate: [ OktaAuthGuard ]  }, 
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'search/:keyword', component: ProductListComponent },
  { path: 'category/:id/:name', component: ProductListComponent },
  { path: 'category', component: ProductListComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'error', component: ErrorPageComponent },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: '**', redirectTo: '/products', pathMatch: 'full' }
]

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    CategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent,
    OrderHistoryComponent,
    ReviewProductComponent,
    ErrorPageComponent,
    AutoFocusDirective,
    FocusInvalidDirective,
    ProfileComponent,
    AdminUserComponent,
    AdminProductComponent,
    AdminOrderComponent,
    AdminCategoryComponent,
    CategoryEditComponent,
    CategoryAddComponent,
    ProductAddComponent,
    ProductEditComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    OktaAuthModule,
    MatTooltipModule,
    MatSortModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 1200,
      progressBar: true,
      progressAnimation: 'increasing'
    }),
    NgxSpinnerModule
  ],
  providers: [ProductService, { provide: OKTA_CONFIG, useValue: oktaConfig },
                              {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
