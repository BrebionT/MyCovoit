import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  dataUser = {
    email: '',
    password: ''
  };
  utilisateurs: Observable<any[]>;
  public userid;
  public connected: boolean = false;

  constructor(public firestore: AngularFirestore,
    public afAuth: AngularFireAuth
    ) { 
    this.connecter();
    this.utilisateurs = this.firestore.collection('utilisateurs').valueChanges();
  }

  connecter(){
    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        this.userid = auth.uid;
        console.log(this.userid);
      }
    });
  }

  ngOnInit() {
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
  

}
