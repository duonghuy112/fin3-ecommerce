import { Category } from './category';
export class Product {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public unitPrice: number,
        public imageUrl: string,
        public active: boolean,
        public dateCreated: Date,
        public lastUpdated: Date,
        public isDeleted: number,
        public category: Category) {}
}
