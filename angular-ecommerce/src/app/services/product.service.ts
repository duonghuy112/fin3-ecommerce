import { ResponseCategories } from './../response/response-categories';
import { ResponseProducts } from './../response/response-products';
import { Category } from './../common/category';
import { Product } from './../common/product';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productUrl = environment.baseUrl + '/products';
  categoryUrl = environment.baseUrl + '/category';

  constructor(private httpClient: HttpClient) { }

  getProductListPaginate(page: number, pageSize: number): Observable<ResponseProducts> {
      // build URL paging
      const searchUrl = `${this.productUrl}?page=${page}&size=${pageSize}`;
      return this.httpClient.get<ResponseProducts>(searchUrl);
  }

  getProductListByCategoryPaginate(categoryId: number, page: number, pageSize: number): Observable<ResponseProducts> {
    // build URL based on categoryId
    const searchUrl = `${this.productUrl}/search/findByCategoryId?id=${categoryId}&page=${page}&size=${pageSize}`;
    return this.httpClient.get<ResponseProducts>(searchUrl);
  }
    
  searchProductsPaginate(keyword: string, page: number, pageSize: number): Observable<ResponseProducts> {
    // build URL based on keyword
    const searchUrl = `${this.productUrl}/search/findByNameContaining?name=${keyword}&page=${page}&size=${pageSize}`;
    return this.httpClient.get<ResponseProducts>(searchUrl);
  }
  
  getProduct(productId: number): Observable<Product> {
    const productIdUrl = `${this.productUrl}/${productId}`;
    return this.httpClient.get<Product>(productIdUrl);
  }

  getCategories(): Observable<Category[]> {
    return this.httpClient.get<ResponseCategories>(this.categoryUrl)
                          .pipe (map(response => response._embedded.category));
  }
}
