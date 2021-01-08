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
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']

})



export class Tab2Page implements OnInit{
  

dataUser = {
  email: '',
  password: ''
};

public connected: boolean = false;


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

  ngOnInit(){
    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        //console.log('non connecté');
        this.connected = false;
      } else {
        //console.log('connecté: ' + auth.uid);
        this.connected = true;
      }
    });
  }
  
  
    returnConnected(){
    return this.connected;
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
            route.navigateByUrl('/tabs/tableaubord');
          },1000)
        })  
      })
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

