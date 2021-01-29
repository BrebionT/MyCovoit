import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecherchetrajetPage } from './recherchetrajet.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { RecherchetrajetPageRoutingModule } from './recherchetrajet-routing.module';
import { NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RecherchetrajetPageRoutingModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  declarations: [RecherchetrajetPage]
})
export class RecherchetrajetPageModule {}