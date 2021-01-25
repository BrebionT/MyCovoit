import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoterPageRoutingModule } from './noter-routing.module';

import { NoterPage } from './noter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoterPageRoutingModule
  ],
  declarations: [NoterPage]
})
export class NoterPageModule {}
