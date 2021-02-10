import { Component, OnInit } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';

import { AngularFireDatabase } from '@angular/fire/database';

import {AngularFirestore} from '@angular/fire/firestore';

import { AngularFireAuth } from '@angular/fire/auth';

import { Router } from '@angular/router';

import { Platform, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-connexion',
  templateUrl: 'connexion.page.html',
  styleUrls: ['connexion.page.scss']

})



export class ConnexionPage{
  

dataUser = {
  email: '',
  password: ''
};

passwordType: string = 'password';
 passwordIcon: string = 'eye-off';

public connected: boolean = false;
public charge: boolean = false;


  constructor(
    private router: Router,
    public toastController: ToastController,
    public afAuth: AngularFireAuth,
    public afDB: AngularFireDatabase,
    public firestore: AngularFirestore,
    public platform: Platform,
    public loadingController: LoadingController
  ) {
    
    }

  


  returnConnected(){
    return this.connected;
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
}
  

  logout() {
    this.afAuth.signOut();
    this.connected=false;
    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        this.connected = false;
      } else {
        this.connected = true;
      }});

    this.dataUser = {
      email: '',
      password: ''
    };
    //console.log(this.connected, this.dataUser)
  }
  

  
  login() {
    var route = this.router;
    this.afAuth.signInWithEmailAndPassword(this.dataUser.email, this.dataUser.password)
    .then(auth => {
      //console.log('utilisateur connecté');
      this.connected=true;

      this.platform.ready().then(()=>{        //Creation d'une plateforme d'attente pour la connexion
        this.loadingController.create({
          message:"🚗 En route..."
        }).then((loadingElement)=>{
          loadingElement.present();
          var ref = this;
          setTimeout(function(){
            ref.loadingController.dismiss();
            route.navigateByUrl('/tabs/tableaubord',{
              replaceUrl : true
             });
          },1000)
        })  
      })
    })
    .catch(err => {
      //console.log('Erreur: ' + err);
      this.dataUser.password = "";
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
    this.router.navigateByUrl('/inscription',{
      replaceUrl : true
     });
  }

  motDePasseOublie(){
    this.router.navigateByUrl('/motdepasseoublie',{
      replaceUrl : true
     });
  }

  /* sendPasswordResetEmail(email){
    this.afAuth.sendPasswordResetEmail(email);
  } */
}

