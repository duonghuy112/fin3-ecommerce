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

  getProductList(categoryId: number): Observable<Product[]> {

    // build URL based on categoryId
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl)
                          .pipe (map(response => response._embedded.products));
  }

  getCategories(): Observable<Category[]> {
    return this.httpClient.get<GetResponseCategory>(this.categoryUrl)
                          .pipe (map(response => response._embedded.category));
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  }
}

interface GetResponseCategory {
  _embedded: {
    category: Category[];
  }
}
