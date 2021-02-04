import { Component, NgModule } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MessagerieModalComponent } from '../messagerie-modal/messagerie-modal.component';
import { ProfilModalComponent } from '../profil-modal/profil-modal.component';
import {AngularFirestore} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import {boole} from '../../environments/environment';

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

  boole = boole;

  messages;

  constructor(public afAuth: AngularFireAuth,private modalCtrl: ModalController,public firestore: AngularFirestore,) {

    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        this.connected = false;
      } else {
        this.userId = auth.uid;
        this.connected = true;
      }
    })
  }


  ngOnInit() {
    var that = this;

    this.messages = this.firestore.collection("messages").valueChanges().subscribe(messages => {
      messages.forEach(message =>{
        if(message['destinataire']==that.userId){
          if(message['vu']==false){
            boole.notif = true;
            this.boole.notif=true;
            console.log('bool notif : ',boole.notif)
          }  
        }
      }
    )})
    
    /* const db = this.firestore;
    
    db.collection("messages").get().toPromise().then((snapshot)=>{
      snapshot.docs.forEach(doc =>{

        var value = doc.data();

        if(value['destinataire']==that.userId){
          if(value['vu']==false){
            this.notif = true;
          }    
        }
      });
    }) */
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
