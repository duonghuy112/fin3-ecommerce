import { Review } from './../common/review';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ResponseReview } from '../response/response-review';

@Injectable({
  providedIn: 'root'
})
export class ReviewProductService {

  private reviewUrl = environment.baseUrl + '/reviews';

  constructor(private httpClient: HttpClient) { }

  getReviews(productId: number): Observable<ResponseReview> {
    const reviewByProductIdUrl = `${this.reviewUrl}/search/findByProductId?productId=${productId}`;
    return this.httpClient.get<ResponseReview>(reviewByProductIdUrl);
  }

  
}
