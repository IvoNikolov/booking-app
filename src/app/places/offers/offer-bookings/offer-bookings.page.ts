import { Component, OnInit } from '@angular/core';
import { Place } from '../../places.model';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit {

  place: Place;

  constructor(private route: ActivatedRoute, private navCtrl: NavController, private placeService: PlacesService) { }

  ngOnInit() {
      this.route.paramMap.subscribe(param => {
        if (!param) {
          this.navCtrl.navigateBack('/places/tabs/offers');
          return;
        }
        const placeId = param.get('placeId');
        this.place = this.placeService.getPlace(placeId);
      });
      console.log(this.place);
  }

}
