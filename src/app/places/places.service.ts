import { Injectable } from '@angular/core';
import { Place } from './places.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places = new BehaviorSubject<Place[]>( [
    new Place(
      'p1',
      'Sofia',
      'Capital of Bulgaria',
      'http://careersinbulgaria.eu/wp-content/uploads/2017/03/Visiting-sofia-bulgaria-1200x423.jpg',
      40.00,
      new Date('2020-01-01'),
      new Date('2020-12-31'),
      'abc'
    ),
    new Place(
      'p2',
      'Varna',
      'Sea Capital of Bulgaria',
      'https://www.novinite.com/media/images/2014-08/photo_verybig_162531.jpg',
      20.00,
      new Date('2020-01-01'),
      new Date('2020-12-31'),
      'abc'
    ),
    new Place(
      'p3',
      'Plovdiv',
      'Culture Capital of Europe',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Plovdiv_view.jpg/1200px-Plovdiv_view.jpg',
      30.00,
      new Date('2020-01-01'),
      new Date('2020-12-31'),
      'abc'
    )
  ]);

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService) { }

  getPlace(id: string) {
    return this.places.pipe(take(1), map(places => {
      return { ...places.find(place =>
        place.id === id
      )};
    }));
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    const newPlace = new Place(
        'p' + Math.floor(Math.random() * 110).toString(),
        title,
        description,
        'https://www.freeiconspng.com/uploads/no-image-icon-11.PNG',
        price,
        dateFrom,
        dateTo,
        this.authService.userId
      );
    this.places.pipe(take(1)).subscribe(places => {
      this._places.next(places.concat(newPlace));
    });
    console.log(this._places);
  }
}
