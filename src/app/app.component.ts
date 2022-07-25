import { Component } from '@angular/core';
import { merge, Observable, of } from 'rxjs';
import { map, take, share } from 'rxjs/operators';
import { Market } from './models/Market';
import { PolyStrapiService } from './poly-strapi.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'polymarket-opportunity-scanner';
  loading$: Observable<boolean> | undefined;
  activeMarkets$: Observable<Market[]> | undefined;
  test$: Observable<any> | undefined;
  constructor(private readonly polyStrapiService: PolyStrapiService) {}

  ngOnInit(): void {
    this.activeMarkets$ = this.polyStrapiService.getAllActiveMarkets().pipe(
      map((markets) => {
        return markets.map((market) => {
          return {
            ...market,
            outcomePriceYes: market.outcomePrices[0],
            outcomePriceNo: market.outcomePrices[1],
            endDate: new Date(market.end_date_iso),
            startDate: new Date(market.start_date_iso),
          };
        });
      }),
      share()
    );
    //shows spinner only before first response
    this.loading$ = merge(
      of(true),
      this.activeMarkets$.pipe(
        take(1),
        map(() => false)
      )
    );
  }
}
