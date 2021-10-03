import { Customer } from './../common/customer';
export interface ResponseCustomer {
    content: Customer[];
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
}
