import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { MessagerieModalComponent } from '../messagerie-modal/messagerie-modal.component';
import { ProfilModalComponent } from '../profil-modal/profil-modal.component';
import { NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  declarations: [TabsPage, MessagerieModalComponent, ProfilModalComponent],
  entryComponents: [MessagerieModalComponent, ProfilModalComponent]
})
export class TabsPageModule {}
