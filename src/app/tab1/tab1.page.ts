import { Component, OnInit } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';

import { AngularFireDatabase } from '@angular/fire/database';

import {AngularFirestore} from '@angular/fire/firestore';

import { AngularFireAuth } from '@angular/fire/auth';

import {Observable} from 'rxjs';
import { Router } from '@angular/router';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  trajets: Observable<any[]>;
  conducteur: string;
  heureArrive: string;
  heureDepart: string;
  passager: string;
  villeArrive: string;
  villedepart: string;

  user: Observable<any[]>;

  public connected: boolean = false;
  
  

  dataUser = {
    email: '',
    password: ''
  };
  
  constructor(
    private router: Router,
    public toastController: ToastController,
    public afAuth: AngularFireAuth,
    public afDB: AngularFireDatabase,
    public firestore: AngularFirestore
  ) {
  
}

ngOnInit(){
  this.afAuth.authState.subscribe(auth => {
    if (!auth) {
      this.connected=false;
      this.router.navigateByUrl('/tabs/tab2');
    } else {
      this.connected=true;

    }
  });
}

returnConnected(){
  return this.connected;
}

ionViewWillEnter(){ //Fonction qui se lance dès qu'on arrive sur la page !
  this.afAuth.authState.subscribe(auth => {
    if (!auth) {
      this.connected=false;
      this.router.navigateByUrl('/tabs/tab2');
    } else {
      this.connected=true;
      this.user = this.firestore.collection('user').valueChanges();
      this.trajets = this.firestore.collection('Trajets').valueChanges();

    }
  });
}
  
}
