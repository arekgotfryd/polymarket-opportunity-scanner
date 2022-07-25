import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Market } from './models/Market';

@Injectable({ providedIn: 'root' })
export class PolyStrapiService {
  constructor(private readonly httpService: HttpClient) {}

  getAllActiveMarkets(): Observable<Market[]> {
    return this.httpService
      .get<Market[]>(
        'https://strapi-matic.poly.market/markets?_limit=-1&closed=false'
      )
      // .pipe(
      //   tap((data) => {
      //     console.log(data);
      //   })
      // );
  }
}
