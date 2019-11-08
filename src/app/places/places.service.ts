import { Injectable } from '@angular/core';
import { Place } from './places.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { PlaceLocation } from './location.model';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
  location: PlaceLocation;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places = new BehaviorSubject<Place[]>( [
    // new Place(
    //   'p1',
    //   'Sofia',
    //   'Capital of Bulgaria',
    //   'http://careersinbulgaria.eu/wp-content/uploads/2017/03/Visiting-sofia-bulgaria-1200x423.jpg',
    //   40.00,
    //   new Date('2020-01-01'),
    //   new Date('2020-12-31'),
    //   'abc'
    // ),
    // new Place(
    //   'p2',
    //   'Varna',
    //   'Sea Capital of Bulgaria',
    //   'https://www.novinite.com/media/images/2014-08/photo_verybig_162531.jpg',
    //   20.00,
    //   new Date('2020-01-01'),
    //   new Date('2020-12-31'),
    //   'abc'
    // ),
    // new Place(
    //   'p3',
    //   'Plovdiv',
    //   'Culture Capital of Europe',
    //   'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Plovdiv_view.jpg/1200px-Plovdiv_view.jpg',
    //   30.00,
    //   new Date('2020-01-01'),
    //   new Date('2020-12-31'),
    //   'abc'
    // )
  ]);

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) { }

  fetchPlaces() {
    return this.http
      .get<{[key: string]: PlaceData}>('https://ionic-booking-app-b44d7.firebaseio.com/offered-places.json')
      .pipe(
        map(resData => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(new Place(
                key,
                resData[key].title,
                resData[key].description,
                resData[key].imageUrl,
                resData[key].price,
                new Date(resData[key].availableFrom),
                new Date(resData[key].availableTo),
                resData[key].userId,
                resData[key].location));
            }
          }
          return places;
        }),
        tap(places => {
          console.log(places);
          this._places.next(places);
        })
      );
  }

  getPlace(id: string) {
    return this.http
      .get<PlaceData>(`https://ionic-booking-app-b44d7.firebaseio.com/offered-places/${id}.json`)
      .pipe(
        map(placeData => {
              return new Place(
                id,
                placeData.title,
                placeData.description,
                placeData.imageUrl,
                placeData.price,
                new Date(placeData.availableFrom),
                new Date(placeData.availableTo),
                placeData.userId,
                placeData.location
              );
        })
      );
  }

  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);

    return this.http.post<{imageUrl: string, imagePath: string}>(
      'https://us-central1-ionic-booking-app-b44d7.cloudfunctions.net/storeImage',
      uploadData
    );
  }

  addPlace(title: string, description: string, price: number,
           availableFrom: Date, availableTo: Date, location: PlaceLocation, imageUrl: string) {
    let generatedId: string;
    let newPlace: Place;
    return this.authService.userId.pipe(take(1), switchMap(userId => {
      if (!userId) {
        throw new Error('No user found');
      }

      newPlace = new Place(
        'p' + Math.floor(Math.random() * 110).toString(),
        title,
        description,
        imageUrl,
        price,
        availableFrom,
        availableTo,
        userId,
        location
      );

      return this.http.post<{name: string}>('https://ionic-booking-app-b44d7.firebaseio.com/offered-places.json', {
        ...newPlace, id: null
      });
    }), switchMap(resData => {
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        tap(places => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );
  }

  updatePlace(placeId: string, title: string, description: string) {

    let updatedPlaces: Place[];

    return this.places
    .pipe(
      take(1),
      switchMap(places => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId,
          oldPlace.location
        );
        return this.http
          .put(`https://ionic-booking-app-b44d7.firebaseio.com/offered-places/${placeId}.json`,
            {...updatedPlaces[updatedPlaceIndex], id: null}
          );
      }),
      tap(() => {
          this._places.next(updatedPlaces);
      })
    );
  }
}
