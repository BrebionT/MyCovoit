import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrajetDetailPageRoutingModule } from './trajet-detail-routing.module';

import { TrajetDetailPage } from './trajet-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrajetDetailPageRoutingModule
  ],
  declarations: [TrajetDetailPage]
})
export class TrajetDetailPageModule {}
