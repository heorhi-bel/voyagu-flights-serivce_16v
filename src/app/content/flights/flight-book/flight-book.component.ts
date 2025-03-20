import { Component, OnInit } from '@angular/core';
import { FlightsService } from '../flights.service';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-flight-book',
  templateUrl: './flight-book.component.html',
  styleUrls: ['./flight-book.component.scss']
})
export class FlightBookComponent implements OnInit{
  form: FormGroup<any> | any;
  years: { label: string, value: number }[] = [];

  constructor(private service: FlightsService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = this.service.createForm(this.route.snapshot.params['id']);
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 100 }, (_, i) => ({
      label: `${currentYear - i}`,
      value: currentYear - i
    }));
  }
  onSubmit(){
    console.log("Result::", this.form.getRawValue())
    this.form.markAsChecked();
  }
}
