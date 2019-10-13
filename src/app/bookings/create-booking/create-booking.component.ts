import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Place } from 'src/app/places/places.model';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {

  @Input() selectedPlace: Place;
  @Input() selectedMode: 'select' | 'random';
  @ViewChild('f', {static: false}) form: NgForm;
  startDate: string;
  endDate: string;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    const availableFrom = new Date(this.selectedPlace.dateFrom);
    const availableTo = new Date(this.selectedPlace.dateTo);
    if (this.selectedMode === 'random') {
      this.startDate = new Date(
        availableFrom.getDate()
        + Math.random() * (availableTo.getDate()
        - 7 * 24 * 60 * 60 * 1000
        - availableFrom.getDate())).toISOString();
      this.endDate = new Date(new Date(
        this.startDate).getTime()
        + Math.random() * (new Date(this.startDate).getTime()
        + 6 * 24 * 60 * 60 * 1000
        - new Date(this.startDate).getTime())).toISOString();
    }
  }

  onBookPlace() {
    if (!this.form.valid || !this.datesValid()) {
      return;
    }
    this.modalCtrl.dismiss({ bookingDate: {
      firstName: this.form.valid['first-name'],
      lastName: this.form.valid['last-name'],
      guestNumber: this.form.valid['guest-number'],
      dateFrom: this.form.valid['date-from'],
      dateTo: this.form.valid['date-to'],
    } }, 'confirm');
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  datesValid() {
    const startDate = new Date(this.form.value['date-from']);
    const endDate = new Date(this.form.value['date-to']);
    return endDate > startDate;
  }

}
