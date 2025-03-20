import { FormControl } from "@angular/forms";

export interface Flight {
    id: string;
    price: number;
    flights: FlightSegment[];
  
}
export interface FlightSegment {
    airline: string;
    departure_time: string;
    departure_date: string;
    departure_airport: string;
    arrival_time: string;
    arrival_date: string;
    arrival_airport: string;
    duration_minutes: string;
    stops: number;
}
  
export interface Traveler {
    id: string;
    firstName: string;
    lastName: string;
    gender: 'male' | 'female';
    dayBirth: string;
    monthBirth: string;
    yearBirth: string;
    birthDate: Date | string;
    citizenship: string;
}
export type TravelerFormType = FormTypeOrNull<Traveler>;

export type FormTypeOrNull<ModelDTO> = {
    [Property in keyof ModelDTO]: FormControl<ModelDTO[Property] | null>;
};