import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfosPersoPageRoutingModule } from './infos-perso-routing.module';

import { InfosPersoPage } from './infos-perso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfosPersoPageRoutingModule
  ],
  declarations: [InfosPersoPage]
})
export class InfosPersoPageModule {}
