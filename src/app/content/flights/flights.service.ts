import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, shareReplay } from 'rxjs';
import { Flight } from 'src/app/core/models/flight.model';

@Injectable({ providedIn: 'root' })
export class FlightsService {
  private url = 'https://public-front-bucket.s3.eu-central-1.amazonaws.com/test/test_flights.json'
  private flightsCache$: Observable<Flight[]> | null = null;

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  createForm(id: number | string){
    return this.fb.group({
      id: this.fb.control(id, Validators.required),
      firstName: this.fb.control(null, Validators.required),
      lastName: this.fb.control(null, Validators.required),
      gender: this.fb.control(null, Validators.required),
      monthBirth: this.fb.control(null, Validators.required),
      dayBirth: this.fb.control(null, Validators.required),
      yearBirth: this.fb.control(null, Validators.required),
      birthDate: this.fb.control(null, Validators.required),
      citizenship: this.fb.control(null, Validators.required),
    })
  }

  getFlights(): Observable<Flight[]>{
    if (!this.flightsCache$) {
      return this.http.get<Flight[]>(`${this.url}`).pipe(
        shareReplay(1)
      );
    }
    return this.flightsCache$;
  }
  getStopsLabel(stop: number| string){
    switch(stop){
      case -1:
        return 'All stops'
      case 1:
        return `1 stop`
      default:
        return `${stop} stops`
      
    }
  }
}
