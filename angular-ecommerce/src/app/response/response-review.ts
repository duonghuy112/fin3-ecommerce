import { Review } from './../common/review';
export interface ResponseReview {
    _embedded: {
        reviews: Review[];
    }
}
