import { Component, OnDestroy, OnInit } from '@angular/core';
import { FlightsService } from './flights.service';
import { BehaviorSubject, map, Observable, Subscription } from 'rxjs';
import { Flight } from 'src/app/core/models/flight.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.scss'],
})
export class FlightsComponent implements OnInit, OnDestroy{
  flights: Flight[] = [];
  filteredFlights: Flight[] = [];
  displayedFlights: Flight[] = [];
  
  // Filter fields
  airlines: string[] = [];
  selectedAirlines: string[] = [];
  airports: string[] = [];
  selectedAirports: string[] = [];
  priceRange: number[] = [0, 10000];
  minPrice: number = 0;
  maxPrice: number = 10000;
  // Stops filter
  availableStops: number[] = [];
  selectedStops: number[] = [];

  // Pagination
  pageSize: number = 5;
  currentPage: number = 0;

  // Sorting
  sortField: string = 'price';
  sortOrder: number = 1;

  loading: boolean = false;

  private sub$ = new Subscription()

  constructor(
    protected service: FlightsService, 
    private router: Router,     
  ) {}

  ngOnInit(): void {
    this.loadFlights();
  }
  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }

  loadFlights(): void {
    this.sub$ = this.service.getFlights().subscribe({ 
      next: data => {
        this.flights = data;
        this.filteredFlights = [...this.flights];

        this.availableStops = [-1, ...this.extractUniqueStops(this.flights)];
        
        // Extract unique airlines and airports for filters
        const airlineSet = new Set<string>();
        const airportSet = new Set<string>();
        
        this.flights.forEach(flight => {
          flight.flights.forEach(segment => {
            airlineSet.add(segment.airline);
            airportSet.add(segment.departure_airport);
            airportSet.add(segment.arrival_airport);
          });
        });
        
        this.airlines = Array.from(airlineSet);
        this.airports = Array.from(airportSet);
        
        // Find min and max prices
        this.minPrice = Math.min(...this.flights.map(flight => flight.price));
        this.maxPrice = Math.max(...this.flights.map(flight => flight.price));
        this.priceRange = [this.minPrice, this.maxPrice];
        
        this.applyFiltersAndSort();
      },
      error: (error) => {
        console.error('Error loading flights:', error);
      },
      complete: () => { this.loading = false }
    });
  }
  applyFiltersAndSort(): void {
    // Apply airline filter
    let result = this.flights;
  
    if (this.selectedAirlines.length > 0) {
      result = result.filter(flight => 
        flight.flights.some(segment => 
          this.selectedAirlines.includes(segment.airline)
        )
      );
    }
    // Apply airport filter
    if (this.selectedAirports.length > 0) {
      result = result.filter(flight => 
        flight.flights.some(segment => 
          this.selectedAirports.includes(segment.departure_airport) || 
          this.selectedAirports.includes(segment.arrival_airport)
        )
      );
    }
    
    result = result.filter(flight => {
      // Price filter
      if (flight.price < this.priceRange[0] || flight.price > this.priceRange[1]) {
        return false;
      }
      // Stops filter
      if (this.selectedStops.length > 0) {
        // Check if all segments match selected stops count
        const hasSelectedStops = flight.flights.some(segment => {
          if(this.selectedStops.includes(-1)) return true;
          return this.selectedStops.includes(segment.stops)
        });
        if (!hasSelectedStops) return false;
      }
      return true;
    })
     
    // Apply sorting
    result.sort((a, b) => {
      if (this.sortField === 'price') {
        return (a.price - b.price) * this.sortOrder;
      } else if (this.sortField === 'departure') {
        // Sort by departure datetime of first segment
        const dateA = this.getFullDate(a.flights[0].departure_date, a.flights[0].departure_time);
        const dateB = this.getFullDate(b.flights[0].departure_date, b.flights[0].departure_time);
        return (dateA.getTime() - dateB.getTime()) * this.sortOrder;
      } else if (this.sortField === 'duration') {
        // Sort by total duration
        const durationA = a.flights.reduce((sum, segment) => +sum + +segment.duration_minutes, 0);
        const durationB = b.flights.reduce((sum, segment) => +sum + +segment.duration_minutes, 0);
        return (durationA - durationB) * this.sortOrder;
      }
      return 0;
    });
     
    this.filteredFlights = result;
    this.updateDisplayedFlights();
  }
  extractUniqueStops(flights: Flight[]): number[] {
    const stopsSet = new Set<number>();
    flights.forEach(flight => {
      flight.flights.forEach(segment => {
        stopsSet.add(segment.stops);
      });
    });
    return Array.from(stopsSet).sort((a, b) => a - b);
  }
  updateDisplayedFlights(): void {
    const start = this.currentPage * this.pageSize;
    this.displayedFlights = this.filteredFlights.slice(0, start + this.pageSize);
  }

  showMore(): void {
    this.currentPage++;
    this.updateDisplayedFlights();
  }

  onSortChange(event: any){
    const { field, order } = event.value;
    this.sortField = field;
    this.sortOrder = order;
    this.applyFiltersAndSort();
  }
  getFullDate(date: string, time:string){
    return new Date(`${date}T${time}`)
  }
  formatDuration(minutes: number): string {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }
}
