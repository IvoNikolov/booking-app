import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../places.model';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {

  loadedPlaces: Place[];
  selectedPlace: Place;
  private placesSub: Subscription;


  constructor(private placeService: PlacesService) { }

  ngOnInit() {

    this.placesSub = this.placeService.places.subscribe( places => {
      this.loadedPlaces = places;
      this.selectedPlace = this.loadedPlaces[0];
    });
  }

  onSelectPlace(id: string) {
    this.selectedPlace = this.loadedPlaces.find( places => {
      return places.id === id;
    });
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    console.log(event.detail);
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

}
