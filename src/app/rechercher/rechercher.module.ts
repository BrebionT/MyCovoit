import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RechercherPageRoutingModule } from './rechercher-routing.module';

import { RechercherPage } from './rechercher.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RechercherPageRoutingModule
  ],
  declarations: [RechercherPage]
})
export class RechercherPageModule {}