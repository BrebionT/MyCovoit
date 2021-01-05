import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-messagerie-modal',
  templateUrl: './messagerie-modal.component.html',
  styleUrls: ['./messagerie-modal.component.scss'],
})
export class MessagerieModalComponent {

  constructor(private modalCtrl: ModalController) { }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

}
