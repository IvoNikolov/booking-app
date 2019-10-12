import { Component, OnInit } from '@angular/core';
import { Place } from '../../places.model';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss']
})
export class EditOfferPage implements OnInit {

  place: Place;
  form: FormGroup;

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
      this.place = this.placeService.getPlace(placeId);
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
  }

  onEditOffer() {
    if (!this.form.valid) {
      return;
    }

    console.log('edit');
  }
}
