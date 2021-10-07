import { Category } from './../common/category';
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

  getProductListPaginateDesc(page: number, pageSize: number, sort: string): Observable<ResponseProducts> {
    // build URL paging
    const searchUrl = `${this.productUrl}/findAllDesc?isDeleted=0&page=${page}&size=${pageSize}&sort=${sort}`;
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

  getProductById(productId: number): Observable<Product> {
    return this.httpClient.get<Product>(`${this.productUrl}/findById?id=${productId}&isDeleted=0`);
  }

  addProduct(product: Product): Observable<Product> {
    return this.httpClient.post<Product>(`${this.productUrl}`, product);
  }

  updateProduct(product: Product): Observable<Product> {
    return this.httpClient.put<Product>(`${this.productUrl}/${product.id}`, product);
  }

  countProduct(categoryId: number): Observable<number> {
    return this.httpClient.get<number>(`${this.productUrl}/countProductByCategory?categoryId=${categoryId}&isDeleted=0`);
  }

  getCategories(page: number, pageSize: number): Observable<ResponseCategories> {
    return this.httpClient.get<ResponseCategories>(`${this.categoryUrl}?isDeleted=0&page=${page}&size=${pageSize}`);
  }

  getCategoriesByName(name:string, page: number, pageSize: number): Observable<ResponseCategories> {
    return this.httpClient.get<ResponseCategories>(`${this.categoryUrl}/findByName?name=${name}&isDeleted=0&page=${page}&size=${pageSize}`);
  }

  getCategory(categoryId: number): Observable<Category> {
    return this.httpClient.get<Category>(`${this.categoryUrl}/findById?id=${categoryId}&isDeleted=0`);
  }

  addCategory(category: Category): Observable<Category> {
    return this.httpClient.post<Category>(`${this.categoryUrl}`, category);
  }

  updateCategory(category: Category): Observable<Category> {
    return this.httpClient.put<Category>(`${this.categoryUrl}/${category.id}`, category);
  }
}
