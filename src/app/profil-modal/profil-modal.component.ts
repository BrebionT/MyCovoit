import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-profil-modal',
  templateUrl: './profil-modal.component.html',
  styleUrls: ['./profil-modal.component.scss'],
})
export class ProfilModalComponent {

  constructor(private modalCtrl: ModalController) { }

  dismissModal() {
    this.modalCtrl.dismiss();
  }
}
