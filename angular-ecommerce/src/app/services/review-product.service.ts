import { ResponseReview } from './../response/response-review';
import { Review } from './../common/review';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewProductService {

  private reviewUrl = environment.baseUrl + '/reviews';

  constructor(private httpClient: HttpClient) { }

  getReviews(productId: number, page: number, pageSize: number): Observable<ResponseReview> {
    const reviewByProductIdUrl = `${this.reviewUrl}/findByProductId?productId=${productId}&isDeleted=0&page=${page}&size=${pageSize}`;
    return this.httpClient.get<ResponseReview>(reviewByProductIdUrl);
  }

  addReview(review: Review): Observable<Review> {
    return this.httpClient.post<Review>(this.reviewUrl, review);
  }

  updateReview(review: Review): Observable<Review> {
    const reviewUpdateUrl = `${this.reviewUrl}/${review.id}`
    return this.httpClient.put<Review>(reviewUpdateUrl, review);
  }
  
  getStarReview(productId: number): Observable<number> {
    return this.httpClient.get<number>(`${this.reviewUrl}/countStarByProducyId?productId=${productId}`);
  }

  get(reviewId: number): Observable<Review> {
    return this.httpClient.get<Review>(`${this.reviewUrl}/findById?id=${reviewId}&isDeleted=0`);
  }
}
