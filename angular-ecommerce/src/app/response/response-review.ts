import { Review } from './../common/review';
export interface ResponseReview {
    _embedded: {
        reviews: Review[];
    }
    page: {
        size: number,
        totalElements: number,
        totalPages: number,
        number: number
      }
}
