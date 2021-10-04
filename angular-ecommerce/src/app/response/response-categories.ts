import { Category } from './../common/category';
export interface ResponseCategories {
  content: Category[];
  size: number,
  totalElements: number,
  totalPages: number,
  number: number
}
