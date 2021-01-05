import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MessagerieModalComponent } from '../messagerie-modal/messagerie-modal.component';
import { ProfilModalComponent } from '../profil-modal/profil-modal.component';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  accounts = [

  ];

  constructor(private modalCtrl: ModalController) {}

  async openProfilModal() {
    const modal = await this.modalCtrl.create({
      component: ProfilModalComponent
    });

    await modal.present();
  }

  async openMessagerieModal() {
    const modal = await this.modalCtrl.create({
      component: MessagerieModalComponent
    });

    await modal.present();
  }

}
