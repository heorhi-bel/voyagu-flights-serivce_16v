import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FlightsComponent } from "./flights.component";
import { FlightBookComponent } from "./flight-book/flight-book.component";

const routes: Routes = [
    {
      path: '',
      component: FlightsComponent,
    },
    {
        path: ':id',
        data: {
            type: 'type',
            more_data: '...'
        },
        component: FlightBookComponent,
    },
    { path: '**', redirectTo: '/flights' }
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class FlightsRoutingModule {}
  