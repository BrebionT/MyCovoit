import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProposerPage } from './proposer.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { ProposerPageRoutingModule } from './Proposer-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: ProposerPage }]),
    ProposerPageRoutingModule,
  ],
  declarations: [ProposerPage]
})
export class ProposerPageModule {}


