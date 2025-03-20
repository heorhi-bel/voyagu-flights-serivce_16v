import { Component, OnInit } from '@angular/core';
import { FlightsService } from '../flights.service';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Traveler, TravelerFormType } from 'src/app/core/models/flight.model';
import { CitizenshipOptions, DayOptions, Genders, MonthOptions, YearOptions } from 'src/app/core/models/dictionaries';


@Component({
  selector: 'app-flight-book',
  templateUrl: './flight-book.component.html',
  styleUrls: ['./flight-book.component.scss']
})
export class FlightBookComponent implements OnInit{
  genderOptions = Genders;
  monthOptions = MonthOptions;
  dayOptions = DayOptions;
  citizenshipOptions = CitizenshipOptions;
  yearOptions = YearOptions;
  
  form: FormGroup<TravelerFormType | any> = this.service.createForm(this.route.snapshot.params['id'])
  submitted = false;
  constructor(
    private service: FlightsService, 
    private router: Router,
    protected route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (!this.route.snapshot.params['id']) {
      this.router.navigate(['/flights']);
      return;
    }
    const currentYear = new Date().getFullYear();
    
    this.form.patchValue(JSON.parse(sessionStorage.getItem('form')!));
  }
  onSubmit(): void {
    const formRaw = this.form.getRawValue();
    const birthDate = new Date(`${formRaw.yearBirth}-${formRaw.monthBirth}-${formRaw.dayBirth}`)

    this.submitted = true;
    this.form.controls['birthDate'].patchValue(birthDate)

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    
    sessionStorage.setItem('form', JSON.stringify(this.form.value));
    
    console.log('Booking submitted:', {
      flightId: this.form.controls['id'].value,
      form: formRaw,
    });
    
    alert(`Booking submitted successfully!\nFlight ID: ${formRaw.id}\nPassenger: ${formRaw.firstName} ${formRaw.lastName}`);
  
  }
  onBack(){
    if (this.form.dirty) {
      sessionStorage.setItem('form', JSON.stringify(this.form.value));
    }
    this.router.navigate(this.route.snapshot.url)
  }
  getPriceFormat(price: string | number){
    return (+price).toFixed(2);
  }
}
