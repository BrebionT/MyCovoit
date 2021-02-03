import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilAutrePageRoutingModule } from './profil-autre-routing.module';

import { ProfilAutrePage } from './profil-autre.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilAutrePageRoutingModule
  ],
  declarations: [ProfilAutrePage]
})
export class ProfilAutrePageModule {}
