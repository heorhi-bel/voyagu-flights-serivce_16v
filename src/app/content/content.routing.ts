import { Routes } from "@angular/router";

export const LOGGED_ROUTES: Routes = [
    {
        path: 'flights',
        data: {
            i18n: ['flights', 'enums'],
        },
        loadChildren: () => import('./flights/flights.module').then(m => m.FlightsModule),
    },
]