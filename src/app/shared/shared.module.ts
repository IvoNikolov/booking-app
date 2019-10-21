import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationPickerComponent } from '../shared/pickers/location-picker/location-picker.component';
import { MapModalComponent } from '../shared/map-modal/map-modal.component';
import { IonicModule } from '@ionic/angular';
import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';

@NgModule({
  declarations: [LocationPickerComponent, MapModalComponent, ImagePickerComponent],
  imports: [CommonModule, IonicModule],
  exports: [LocationPickerComponent, MapModalComponent, ImagePickerComponent],
  entryComponents: [MapModalComponent]
})

export class SharedModule {

}
