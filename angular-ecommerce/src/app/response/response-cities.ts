import { City } from './../common/city';
export interface ResponseCities {
    _embedded: {
        cities: City[];
    }
}
