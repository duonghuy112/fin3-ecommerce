import { Product } from './../common/product';
export interface ResponseProducts {
    _embedded: {
        products: Product[];
      }
      page: {
        size: number,
        totalElements: number,
        totalPages: number,
        number: number
      }
}
