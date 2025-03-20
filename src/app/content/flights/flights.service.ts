import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FlightsService {
  private url = 'https://public-front-bucket.s3.eu-central-1.amazonaws.com/test/test_flights.json'
  
  constructor(private http: HttpClient, private fb: FormBuilder) {}

  createForm(id: number | string){
    return this.fb.group({
      id: this.fb.control(id, Validators.required),
      firstName: this.fb.control('', Validators.required),
      lastName: this.fb.control('', Validators.required),
      gender: this.fb.control('', Validators.required),
      monthBirth: this.fb.control('', Validators.required),
      dayBirth: this.fb.control('', Validators.required),
      yearBirth: this.fb.control('', Validators.required),
      citizenship: this.fb.control('', Validators.required),
    })
  }

  getFlights(): Observable<any>{
    return this.http.get<any>(`${this.url}`)
  }
}
