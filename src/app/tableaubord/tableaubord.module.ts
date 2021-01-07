import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableaubordPage } from './tableaubord.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { TableaubordPageRoutingModule } from './tableaubord-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    TableaubordPageRoutingModule
  ],
  declarations: [TableaubordPage]
})
export class TableaubordPageModule {}
