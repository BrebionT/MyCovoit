import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { MessagerieModalComponent } from '../messagerie-modal/messagerie-modal.component';
import { ProfilModalComponent } from '../profil-modal/profil-modal.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule
  ],
  declarations: [TabsPage, MessagerieModalComponent, ProfilModalComponent],
  entryComponents: [MessagerieModalComponent, ProfilModalComponent]
})
export class TabsPageModule {}
