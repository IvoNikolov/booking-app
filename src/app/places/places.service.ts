import { Injectable } from '@angular/core';
import { Place } from './places.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places: Place[] = [
    new Place(
      'p1',
      'Sofia',
      'Capital of Bulgaria',
      'http://careersinbulgaria.eu/wp-content/uploads/2017/03/Visiting-sofia-bulgaria-1200x423.jpg',
      40.00
    ),
    new Place(
      'p2',
      'Varna',
      'Sea Capital of Bulgaria',
      'https://www.novinite.com/media/images/2014-08/photo_verybig_162531.jpg',
      20.00
    ),
    new Place(
      'p3',
      'Plovdiv',
      'Culture Capital of Europe',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Plovdiv_view.jpg/1200px-Plovdiv_view.jpg',
      30.00
    )
  ];

  get places() {
    return [...this._places];
  }

  constructor() { }

  getPlace(id: string) {
    return { ...this._places.find(place =>
      place.id === id
    )};
  }
}
