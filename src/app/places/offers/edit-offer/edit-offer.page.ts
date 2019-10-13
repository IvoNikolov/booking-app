import { Component, OnInit, OnDestroy } from '@angular/core';
import { Place } from '../../places.model';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss']
})
export class EditOfferPage implements OnInit, OnDestroy {

  place: Place;
  form: FormGroup;
  private placesSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placeService: PlacesService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      const placeId = paramMap.get('placeId');
      this.placesSub = this.placeService.getPlace(placeId).subscribe(place => {
        this.place = place;

        this.form = new FormGroup({
          title: new FormControl(
            this.place.title, {updateOn: 'blur', validators: [Validators.required]}),
          description: new FormControl(
            this.place.description, {updateOn: 'blur', validators: [Validators.required, Validators.maxLength(180)]}),
          price: new FormControl(this.place.price, {updateOn: 'blur', validators: [Validators.required, Validators.min(1)]}),
          dateFrom: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]}),
          dateTo: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]}),
        });
      });
    });
  }

  onEditOffer() {
    if (!this.form.valid) {
      return;
    }
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
