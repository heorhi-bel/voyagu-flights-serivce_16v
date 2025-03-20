// src/app/core/services/state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Traveler } from 'src/app/core/models/flight.model';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private selectedFlightIdSource = new BehaviorSubject<string | null>(null);
  selectedFlightId$ = this.selectedFlightIdSource.asObservable();
  
  private travelerDataSource = new BehaviorSubject<Traveler | null>(null);
  travelerData$ = this.travelerDataSource.asObservable();
  
  setSelectedFlightId(id: string): void {
    this.selectedFlightIdSource.next(id);
  }
  
  setTravelerData(data: Traveler): void {
    this.travelerDataSource.next(data);
  }
}