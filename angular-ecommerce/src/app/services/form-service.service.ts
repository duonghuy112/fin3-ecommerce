import { ResponseCities } from './../response/response-cities';
import { ResponseCountries } from './../response/response-countries';
import { City } from './../common/city';
import { map } from 'rxjs/operators';
import { Country } from './../common/country';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormServiceService {

  private countriesUrl = environment.baseUrl + '/countries';
  private citiesUrl = environment.baseUrl + '/cities';

  constructor(private httpClient: HttpClient) { }

  // Countries for Shipping Address
  getCountry(): Observable<Country[]> {
    return this.httpClient.get<ResponseCountries>(this.countriesUrl).pipe (
      map (response => response._embedded.countries)
    );
  }

  // Cities for Shipping Address
  getCity(countryCode: string): Observable<City[]> {
    const searchCitiesUrl = `${this.citiesUrl}/search/findByCountryCode?code=${countryCode}`;
    return this.httpClient.get<ResponseCities>(searchCitiesUrl).pipe (
      map (response => response._embedded.cities)
    );
  }

  // Month for Credit Card
  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    // build an array for Month
    for (let month = startMonth; month <= 12; month++) {
      data.push(month);
    }
    return of(data);
  }

  // Year for Credit Card
  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];

    // build an array for Year
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for(let year = startYear; year <= endYear; year++) {
      data.push(year);
    }
    return of(data);
  }
}