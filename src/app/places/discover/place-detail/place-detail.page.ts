import { Component, OnInit, OnDestroy, ErrorHandler } from '@angular/core';
import { NavController, ModalController, ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { PlacesService } from '../../places.service';
import { Place } from '../../places.model';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { Subscription } from 'rxjs';
import { BookingsService } from 'src/app/bookings/bookings.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss']
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  isBookable = false;
  isLoading = false;
  private placesSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placeService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingsService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router: Router
  ) {}


  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.isLoading = true;
      const placeId = paramMap.get('placeId');
      this.placesSub = this.placeService
        .getPlace(placeId)
        .subscribe(place => {
          this.place = place;
          this.isBookable = place.userId !== this.authService.userId;
          this.isLoading = false;
        }, error => {
          this.alertCtrl.create({
            header: 'Alert',
            message: 'Could not fetch data!',
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                  this.router.navigate(['/places/tabs/discober']);
                }
              }
            ]
          }).then(alertEl => {
            alertEl.present();
          });
        });
    });
  }

  onBookPlace() {
    this.actionSheetCtrl.create({
      header: 'Choose an action',
      buttons: [
        {
          text: 'Select Date',
          handler: () => {
            this.openBookingModal('select');
          }
        },
        {
          text: 'Random Date',
          handler: () => {
            this.openBookingModal('random');
          }
        },
        {
            text: 'Cancel',
            role: 'cancel'
        }
      ]
    }).then(actionEl => {
      actionEl.present();
    });
  }

  openBookingModal(mode: 'select' | 'random') {
    this.modalCtrl
    .create({
      component: CreateBookingComponent,
      componentProps: { selectedPlace: this.place, selectedMode: mode }
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultData => {
      const data = resultData.data.bookingDate;
      if (resultData.role === 'confirm') {

        this.loadingCtrl.create({message: 'Booking place...'}).then(loadingEl => {
          loadingEl.present();
          this.bookingService.addBooking(
            this.place.id,
            this.place.title,
            this.place.imageUrl,
            data.firstName,
            data.lastName,
            data.guestNumber,
            data.startDate,
            data.endDate
          ).subscribe(() => {
            loadingEl.dismiss();
          });
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
