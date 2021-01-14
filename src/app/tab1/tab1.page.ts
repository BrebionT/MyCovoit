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

  conducteur: string;
  heureArrive: string;
  heureDepart: string;
  passager: string;
  villeArrive: string;
  villedepart: string;

  utilisateurs: Observable<any[]>;
  trajets: Observable<any[]>;
  uti_tra: Observable<any[]>;

  utilisateur: Observable<any[]>;
  public trajet= Array();
  public uti_tras=Array();

  public connected: boolean = false;

  subscri : any;

  public util;
  public userid;
  
  

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

    this.utilisateurs = this.firestore.collection('utilisateurs').valueChanges();
    this.trajets = this.firestore.collection('trajets').valueChanges();
    this.uti_tra = this.firestore.collection('utilisateur_trajet').valueChanges();

    this.getAuth();
    this.getUtilisateur();
    this.getUtiTrajetByUti();
    

  }

getAuth(){
  this.afAuth.authState.subscribe(auth => {
    if (!auth) {
      this.connected=false;
      this.router.navigateByUrl('/tabs/tab2');
    } else {
      this.connected=true;
      this.userid = auth.uid;
    }
  });

  
}


getUtilisateur(){
  var that = this;
  this.utilisateurs.subscribe(uti =>{
    uti.forEach(value => {
      if(value['id']==that.userid){
        that.utilisateur = value;
      }
    })
  });
  
}

getUtiTrajetByUti(){
  var that = this;
  this.uti_tra.subscribe(uti =>{
    uti.forEach(value2=> {
      if(value2['uti_tra_idUti']==that.userid){
        that.uti_tras.push(value2);
        this.getTrajet(value2['uti_tra_idTra']);
      }
    })    
  });
}

getTrajet(idUtiTra){
  var that = this;
  this.trajets.subscribe(tra =>{
    tra.forEach(value3 => {
      if(value3['id']==idUtiTra){
        that.trajet.push(value3);
      }
    })    
  });
}

ngOnInit(){

}
      

returnConnected(){
  return this.connected;
}
}