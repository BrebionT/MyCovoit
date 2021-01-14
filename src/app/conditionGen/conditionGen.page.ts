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
  selector: 'app-conditionGen',
  templateUrl: 'conditionGen.page.html',
  styleUrls: ['conditionGen.page.scss']

})



export class ConditionGenPage implements OnInit{
  

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
  }


  returnConnected(){
    return this.connected;
  }

  
}