import { Component } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';

import { AngularFireDatabase } from '@angular/fire/database';

import {AngularFirestore} from '@angular/fire/firestore';

import { AngularFireAuth } from '@angular/fire/auth';

import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})



export class Tab2Page {
  
  /*loginData = {
  email: '',
  password: ''
  
};*/

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
  });}

 /* add() {
    this.firestore.collection('User').add({
      pseudo: 'jeje'
    });
  }*/

  /*login() {
    this.afAuth.signInWithEmailAndPassword(this.dataUser.email, this.dataUser.password);
     this.dataUser = {
       email: '',
       password: ''
     };
  }*/
  



  
  login() {
    this.afAuth.signInWithEmailAndPassword(this.dataUser.email, this.dataUser.password)
    .then(auth => {
      console.log('utilisateur connecté');
      this.router.navigateByUrl('/tabs/tab1');
    })
    .catch(err => {
      console.log('Erreur: ' + err);
      this.errorMail();
    });
  }async errorMail() {
    const toast = await this.toastController.create({
      message: 'Email ou mot de passe incorrect',
      duration: 1500,
      position: 'middle'
    });
    toast.present();
  }
 
  Inscript(){
    this.router.navigateByUrl('/tabs/inscription');
  }
 

}

