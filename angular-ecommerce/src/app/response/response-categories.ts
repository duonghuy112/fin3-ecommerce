import { Category } from './../common/category';
export interface ResponseCategories {
    _embedded: {
        category: Category[];
      }
}
