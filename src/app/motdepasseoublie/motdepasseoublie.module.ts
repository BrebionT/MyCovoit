import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MotdepasseoubliePageRoutingModule } from './motdepasseoublie-routing.module';

import { MotdepasseoubliePage } from './motdepasseoublie.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MotdepasseoubliePageRoutingModule
  ],
  declarations: [MotdepasseoubliePage]
})
export class MotdepasseoubliePageModule {}
