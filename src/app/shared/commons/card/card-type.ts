export type CardType = {
    id: number;
    price: number;
    flights: CardFligthsType[];
}

export type CardFligthsType = {
    departure_date: string;
    departure_time: string;
    departure_airport: string;
    duration_minutes: number;
    arrival_date: string;
    arrival_time: string;
    arrival_airport: string;
    stops: number;
    airline: string;
}