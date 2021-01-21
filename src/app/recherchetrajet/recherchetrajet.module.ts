import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecherchetrajetPage } from './recherchetrajet.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { RecherchetrajetPageRoutingModule } from './recherchetrajet-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RecherchetrajetPageRoutingModule
  ],
  declarations: [RecherchetrajetPage]
})
export class RecherchetrajetPageModule {}