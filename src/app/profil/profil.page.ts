import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
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
  public images = "";
  utilisateurs: Observable<any[]>;
  public userid;
  public connected: boolean = false;
  utilisateur: Observable<any[]>;

  constructor(public firestore: AngularFirestore,
    public afAuth: AngularFireAuth,
    public afDB: AngularFireDatabase,
    public afSG: AngularFireStorage
    ) { 
    this.connecter();
    
    this.utilisateurs = this.firestore.collection('utilisateurs').valueChanges();
    this.getUtilisateur();
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

  getUtilisateur(){
    var that = this;
    this.utilisateurs.subscribe(uti =>{
      uti.forEach(value => {
        if(value['id']==that.userid){
          that.utilisateur = value;
          console.log(value)
          that.getImagesStorage(value['photo'])
        }
      })
    });
    
  }

  getImagesStorage(image: any) {
    console.log(image)
    this.afSG.ref('users/'+image).getDownloadURL().subscribe(imgUrl => {
      console.log(imgUrl);
      this.images= imgUrl;
    });
    console.log("liste images :")
    console.log(this.images)
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
