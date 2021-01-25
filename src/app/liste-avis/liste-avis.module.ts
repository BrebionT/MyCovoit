import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListeAvisPageRoutingModule } from './liste-avis-routing.module';

import { ListeAvisPage } from './liste-avis.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListeAvisPageRoutingModule
  ],
  declarations: [ListeAvisPage]
})
export class ListeAvisPageModule {}
