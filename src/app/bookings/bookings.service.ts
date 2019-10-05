import { Injectable } from '@angular/core';
import { Bookings } from './bookings.model';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  private _bookings: Bookings[] = [
    {
      id: 'xyz',
      placeId: 'p1',
      userId: 'John',
      placeTitle: 'Sofia',
      guestNumber: 1,
    }
  ];

  get bookings() {
    return [...this._bookings];
  }

  constructor() { }
}
