import { Component } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';

import { AngularFireDatabase } from '@angular/fire/database';

import {AngularFirestore} from '@angular/fire/firestore';

import { AngularFireAuth } from '@angular/fire/auth';

import { Router } from '@angular/router';

@Component({
  selector: 'app-inscription',
  templateUrl: 'inscription.page.html',
  styleUrls: ['inscription.page.scss']
})



export class InscriptionPage {
  

dataUser = {
  email: '',
  password: ''
};

connected: boolean;


  constructor(
    private router: Router,
    public toastController: ToastController,
    public afAuth: AngularFireAuth,
    public afDB: AngularFireDatabase,
    public firestore: AngularFirestore
  ) {


    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        console.log('non connecté');
        this.connected = false;
      } else {
        console.log('connecté: ' + auth.uid);
        this.connected = true;
      }
    });

}

  async errorMail(messages) {
    const toast = await this.toastController.create({
      message: messages,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
  
  signUp() {
    if(this.dataUser.email!="" && this.dataUser.password!=""){
      this.afAuth.createUserWithEmailAndPassword(this.dataUser.email, this.dataUser.password).then(auth =>{
        this.dataUser = {
          email: '',
          password: ''
        };
        this.router.navigateByUrl('/tabs/infos-perso');
      })
      .catch(err => {
        console.log('Erreur: ' + err);
        this.errorMail("Mail déjà existant");
      });
    }else{
      this.errorMail("Un des champs est vide");
    }
    
    
  }
 
  Inscript(){
    this.router.navigateByUrl('/tabs/tab2');
  }
 

}

