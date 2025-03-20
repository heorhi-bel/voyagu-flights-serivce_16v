import { Component, OnDestroy, OnInit } from '@angular/core';
import { FlightsService } from './flights.service';
import { BehaviorSubject, map, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.scss'],
})
export class FlightsComponent implements OnInit, OnDestroy{
  flights: any;
  value: number = 1;
  filters: any = {
    stops: [],
    airlines: [],
    price: [0, 0],
  };
  sortBy: string = 'price';

  private subscription$: any;
  private visibleFlights$ = new BehaviorSubject<number>(5);

  displayedFlights$ = this.visibleFlights$.pipe(
    map((count) => this.flights?.slice(0, count))
  );

  constructor(private service: FlightsService) {}

  ngOnInit(): void {
    this.subscription$ = this.service.getFlights().subscribe((data) => {
      this.flights = data;
      this.initializeFilters();
      this.displayedFlights$ = this.getFilteredAndSortedFlights();
    })
  }
  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  initializeFilters(): void {
    this.filters.stops = [...new Set(this.flights.flatMap((f:any) => f.flights.map((flight:any) => flight.stops)))];
    this.filters.airlines = [...new Set(this.flights.flatMap((f:any) => f.flights.map((flight:any) => flight.airline)))];
    this.filters.price[0] = Math.min(...this.flights.map((f:any) => f.price));
    this.filters.price[1] = Math.max(...this.flights.map((f:any) => f.price));
  }
  getFilteredAndSortedFlights(): Observable<any[]> {
    return new BehaviorSubject(this.flights).pipe(
      map((flights) => {
        let filteredFlights = flights.filter((flight:any) =>
          (this.filters.stops.length ? this.filters.stops.includes(flight.flights[0].stops) : true) &&
          (this.filters.airlines.length ? this.filters.airlines.includes(flight.flights[0].airline) : true) &&
          flight.price >= this.filters.price[0] && flight.price <= this.filters.price[1]
        );

        filteredFlights = filteredFlights.sort((a:any, b:any) => {
          if (this.sortBy === 'price') {
            return a.price - b.price;
          } else if (this.sortBy === 'departure_time') {
            return new Date(a.flights[0].departure_time).getTime() - new Date(b.flights[0].departure_time).getTime();
          }
          return 0;
        });

        return filteredFlights;
      })
    );
  }
  onSortChange(sortBy: string | any): void {
    this.sortBy = sortBy;
    this.displayedFlights$ = this.getFilteredAndSortedFlights();
  }

  changeFilter(key: string, value: any | any[]){
    console.log("\|/CHANGE//")
    this.service.getFlights();
    console.log("this.data", this.flights)
  }
  showMore() {
    this.visibleFlights$.next(this.visibleFlights$.value + 5);
  }
}
