import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModifProfilPageRoutingModule } from './modifProfil-routing.module';

import { ModifProfilPage } from './modifProfil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModifProfilPageRoutingModule
  ],
  declarations: [ModifProfilPage]
})
export class ModifProfilPageModule {}