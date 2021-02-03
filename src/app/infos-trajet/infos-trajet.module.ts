import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfosTrajetPageRoutingModule } from './infos-trajet-routing.module';

import { InfosTrajetPage } from './infos-trajet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfosTrajetPageRoutingModule
  ],
  declarations: [InfosTrajetPage]
})
export class InfosTrajetPageModule {}
