import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlightsComponent } from './flights.component';
import { FlightsRoutingModule } from './flights.routing';
import { FlightsService } from './flights.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlightBookComponent } from './flight-book/flight-book.component';

@NgModule({
  imports: [SharedModule, CommonModule, FlightsRoutingModule],
  declarations: [FlightsComponent, FlightBookComponent],
  exports: [FlightsComponent],
  providers: [FlightsService]
})
export class FlightsModule {}
