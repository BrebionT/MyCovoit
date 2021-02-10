import { Component, NgModule } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MessagerieModalComponent } from '../messagerie-modal/messagerie-modal.component';
import { ProfilModalComponent } from '../profil-modal/profil-modal.component';
import {AngularFirestore} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
//import {boole} from '../../environments/environment';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  accounts = [

  ];

  connected;
  userId;

  test;
  nb;
  notif = false;

  messages;

  constructor(public afAuth: AngularFireAuth,private modalCtrl: ModalController,public firestore: AngularFirestore,) {

    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        this.connected = false;
      } else {
        this.userId = auth.uid;
        this.connected = true;

        var that = this;

    const db = this.firestore;

    this.test = this.firestore.collection("messages_vu");
    this.test.ref.where("destinataire", "==", auth.uid);
    this.test.ref.orderBy('id')
    .onSnapshot(function(querySnapshot) {
      that.nb=0;
      querySnapshot.forEach(function(doc) {
        //var value = doc.data();
        //console.log(value['destinataire'],auth.uid)
        if(doc.data()['destinataire']==auth.uid){
          if(doc.data()['vu']==false){
            that.notif = true;
            //console.log('notif')
            that.nb+=1;
            that.notif = true;
          }    
        }
      })
      if(that.nb==0 || that.notif != true){
        //console.log("pas notif")
        that.notif = false;
      }
    })
      }
    })
  }


  ngOnInit() {

  }

  

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
