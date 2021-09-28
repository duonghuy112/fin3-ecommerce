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

  getReviews(productId: number): Observable<Review[]> {
    const reviewByProductIdUrl = `${this.reviewUrl}/findByProductId?productId=${productId}&isDeleted=0`;
    return this.httpClient.get<Review[]>(reviewByProductIdUrl);
  }

  addReview(review: Review): Observable<Review> {
    return this.httpClient.post<Review>(this.reviewUrl, review);
  }

  updateReview(review: Review): Observable<Review> {
    const reviewUpdateUrl = `${this.reviewUrl}/${review.id}`
    return this.httpClient.put<Review>(reviewUpdateUrl, review);
  }
  
}
