import { Injectable } from '@angular/core';
import { Bookings } from './bookings.model';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface BookingData {
  bookedFrom: string;
  bookedTo: string;
  firstName: string;
  guestNumber: number;
  lastName: string;
  placeId: string;
  placeImage: string;
  placeTitle: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  private _bookings = new BehaviorSubject<Bookings[]>([]);

  get bookings() {
    return this._bookings.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) { }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date,
  ) {
    let generatedId: string;
    const newBooking = new Bookings(
      'p' + Math.floor(Math.random() * 110).toString(),
      placeId,
      this.authService.userId,
      placeTitle,
      placeImage,
      firstName,
      lastName,
      guestNumber,
      dateFrom,
      dateTo
    );

    return this.http
    .post<{name: string}>('https://ionic-booking-app-b44d7.firebaseio.com/bookings.json', { ...newBooking, id: null })
    .pipe(
      switchMap(resData => {
        generatedId = resData.name;
        return this.bookings;
      }),
      take(1),
      tap(bookings => {
        newBooking.id = generatedId;
        this._bookings.next(bookings.concat(newBooking));
      })
    );
  }

  cancelBooking(bookingId: string) {
    return this._bookings.pipe(take(1), delay(2000), tap(bookings => {
      this._bookings.next(bookings.filter(b => b.id !== bookingId));
    }));
  }

  fetchBooking() {
    return this.http
    .get<{[key: string]: BookingData}>(
      `https://ionic-booking-app-b44d7.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${
        this.authService.userId
      }"`
    )
    .pipe(
      map(bookingData => {
        const bookings = [];
        for (const key in bookingData) {
          if (bookingData.hasOwnProperty(key)) {
            bookings.push(new Bookings(
              key,
              bookingData[key].placeId,
              bookingData[key].userId,
              bookingData[key].placeTitle,
              bookingData[key].placeImage,
              bookingData[key].firstName,
              bookingData[key].lastName,
              bookingData[key].guestNumber,
              new Date(bookingData[key].bookedFrom),
              new Date(bookingData[key].bookedTo)
            ));
          }
        }
        return bookings;
      }),
      tap(bookings => {
        this._bookings.next(bookings);
      })
    );
  }
}
