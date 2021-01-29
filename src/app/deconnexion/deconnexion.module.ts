import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DeconnexionPage } from './deconnexion.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { DeconnexionPageRoutingModule } from './deconnexion-routing.module';
import { NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';



@NgModule({
  imports: [
    CommonModule,
    ExploreContainerComponentModule,
    DeconnexionPageRoutingModule,
    RouterModule,
     IonicModule.forRoot(),
     DeconnexionPageRoutingModule,
    FormsModule,
    ExploreContainerComponentModule,
    DeconnexionPageRoutingModule
  ],
  declarations: [DeconnexionPage],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class DeconnexionPageModule {}
