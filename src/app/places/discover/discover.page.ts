import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../places.model';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {

  loadedPlaces: Place[];
  relevantPlaces: Place[];
  selectedPlace: Place;
  private placesSub: Subscription;


  constructor(private placeService: PlacesService, private authService: AuthService) { }

  ngOnInit() {

    this.placesSub = this.placeService.places.subscribe( places => {
      this.loadedPlaces = places;
      this.relevantPlaces = this.loadedPlaces;
      this.relevantPlaces = this.loadedPlaces;
      this.selectedPlace = this.loadedPlaces[0];
    });
  }

  onSelectPlace(id: string) {
    this.selectedPlace = this.loadedPlaces.find( places => {
      return places.id === id;
    });
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === 'all') {
      this.relevantPlaces = this.loadedPlaces;
    } else {
      this.relevantPlaces = this.loadedPlaces.filter(place => place.userId !== this.authService.userId);
    }

    this.selectedPlace = this.relevantPlaces[0];
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

}
