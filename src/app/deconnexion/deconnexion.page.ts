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
  selector: 'app-deconnexion',
  templateUrl: 'deconnexion.page.html',
  styleUrls: ['deconnexion.page.scss']

})



export class DeconnexionPage implements OnInit{
  

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
        this.connected = false;
      } else {
        this.connected = true;
      }
    })
  }


  returnConnected(){
    return this.connected;
  }
  

  logout() {
    this.afAuth.signOut();
    this.connected=false;
    
    this.dataUser = {
      email: '',
      password: ''
    };
    this.router.navigateByUrl('/tab2',{
      replaceUrl : true
     });
    //console.log(this.connected, this.dataUser)
  }

}