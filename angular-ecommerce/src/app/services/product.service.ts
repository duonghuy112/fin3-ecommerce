import { ResponseCategories } from './../response/response-categories';
import { ResponseProducts } from './../response/response-products';
import { Product } from './../common/product';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productUrl = environment.baseUrl + '/products';
  categoryUrl = environment.baseUrl + '/category';

  constructor(private httpClient: HttpClient) { }

  getProductListPaginate(page: number, pageSize: number, sort: string): Observable<ResponseProducts> {
      // build URL paging
      const searchUrl = `${this.productUrl}?isDeleted=0&page=${page}&size=${pageSize}&sort=${sort}`;
      return this.httpClient.get<ResponseProducts>(searchUrl);
  }

  getProductListByCategoryPaginate(categoryId: number, page: number, pageSize: number, sort: string): Observable<ResponseProducts> {
    // build URL based on categoryId
    const searchUrl = `${this.productUrl}/findByCategoryId?categoryId=${categoryId}&isDeleted=0&page=${page}&size=${pageSize}&sort=${sort}`;
    return this.httpClient.get<ResponseProducts>(searchUrl);
  }
    
  searchProductsPaginate(keyword: string, page: number, pageSize: number, sort: string): Observable<ResponseProducts> {
    // build URL based on keyword
    const searchUrl = `${this.productUrl}/findByNameContaining?productName=${keyword}&isDeleted=0&page=${page}&size=${pageSize}&sort=${sort}`;
    return this.httpClient.get<ResponseProducts>(searchUrl);
  }
  
  getProduct(productId: number): Observable<Product> {
    const productIdUrl = `${this.productUrl}/${productId}`;
    return this.httpClient.get<Product>(productIdUrl);
  }

  getCategories(): Observable<ResponseCategories> {
    return this.httpClient.get<ResponseCategories>(`${this.categoryUrl}?isDeleted=0&page=0&size=100`);
  }
}
