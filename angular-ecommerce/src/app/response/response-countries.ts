import { Country } from './../common/country';
export interface ResponseCountries {
    _embedded: {
        countries: Country[];
      }
}
