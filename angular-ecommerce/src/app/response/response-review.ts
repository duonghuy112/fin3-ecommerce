import { Review } from './../common/review';
export interface ResponseReview {
    content: Review[];
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
}
