import { Component } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map, retry, switchMap } from 'rxjs/operators';
import { Market } from './models/Market';
import { PolyStrapiService } from './poly-strapi.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'polymarket-opportunity-scanner';
  activeMarkets$: Observable<Market[]> | undefined;
  constructor(private readonly polyStrapiService: PolyStrapiService) {}

  ngOnInit(): void {
    this.activeMarkets$ = timer(1, 15000).pipe(
      switchMap(() => {
        return this.polyStrapiService.getAllActiveMarkets().pipe(
          map((markets) => {
            return markets.map((market) => {
              return {
                ...market,
                outcomePriceYes: +market.outcomePrices[0],
                outcomePriceNo: +market.outcomePrices[1],
                endDate: new Date(market.end_date_iso),
                startDate: new Date(market.start_date_iso),
              };
            });
          })
        );
      }),
      retry()
    );
  }
}
