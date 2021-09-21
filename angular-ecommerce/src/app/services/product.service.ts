import { ResponseCategories } from './../response/response-categories';
import { ResponseProducts } from './../response/response-products';
import { Category } from './../common/category';
import { Product } from './../common/product';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseUrl = "http://localhost:8999/api/products";
  categoryUrl = "http://localhost:8999/api/category";

  constructor(private httpClient: HttpClient) { }

  getProductListPaginate(page: number, pageSize: number): Observable<ResponseProducts> {
      // build URL paging
      const searchUrl = `${this.baseUrl}?page=${page}&size=${pageSize}`;
      return this.httpClient.get<ResponseProducts>(searchUrl);
  }

  getProductListByCategoryPaginate(page: number, pageSize: number, categoryId: number): Observable<ResponseProducts> {
    // build URL based on categoryId
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}&page=${page}&size=${pageSize}`;
    return this.httpClient.get<ResponseProducts>(searchUrl);
  }
    
  searchProductsPaginate(page: number, pageSize: number, keyword: string): Observable<ResponseProducts> {
    // build URL based on keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}&page=${page}&size=${pageSize}`;
    return this.httpClient.get<ResponseProducts>(searchUrl);
  }
  
  getProduct(productId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${productId}`;
    return this.httpClient.get<Product>(productUrl);
  }

  getCategories(): Observable<Category[]> {
    return this.httpClient.get<ResponseCategories>(this.categoryUrl)
                          .pipe (map(response => response._embedded.category));
  }
}
