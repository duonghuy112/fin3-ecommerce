import { Category } from './category';
export class Product {
    id!: number;
    name!: string;
    description!: string;
    unitPrice!: number;
    imageUrl!: string;
    active!: number;
    dateCreated!: Date;
    lastUpdated!: Date;
    isDeleted!: number;
    category!: Category;
}
