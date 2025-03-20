import { Component, Input, OnInit } from '@angular/core';
import { CardType } from './card-type';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent{
  @Input() data: CardType | any;

  constructor(private router: Router) {}

  getDateObject(timeString: string): Date {
    return new Date(`1970-01-01T${timeString}`);
  }
  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}m`;
    }
  }
  stopsLabel(stops: number): string {
    return stops === 0 ? 'Nonstop' : `${stops} stop`;
  }
  book(card: CardType){
    this.router.navigate([`/flights/${card.id}`], {queryParams: card})
  }
}
