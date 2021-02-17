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
  avis: Observable<any[]>;

  public userid;
  public avisValue =0;
  public nbAvis =0;
  public avisTotal;
  public connected: boolean = false;
  utilisateur: {prenom:"",nom:"",sexe:"",photo:"",parle:true,musique:true,cigarette:true,animal:true};


  constructor(public firestore: AngularFirestore,
    public afAuth: AngularFireAuth,
    public afDB: AngularFireDatabase,
    public afSG: AngularFireStorage
    ) { 
    this.connecter();
    
    this.utilisateurs = this.firestore.collection('utilisateurs').valueChanges();
    this.avis = this.firestore.collection('avis').valueChanges();
    this.getUtilisateur();
    this.getAvis();
  }

  connecter(){
    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        this.userid = auth.uid;
        
        //console.log(this.userid);
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
          //console.log(value)
          that.getImagesStorage(value['photo'])
          
          var today = new Date();
          var birthDate = new Date(that.utilisateur["date_naiss"]);
          var age = today.getFullYear() - birthDate.getFullYear();
          var m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
              age = age - 1;
          }
          that.utilisateur['date_naiss'] = age;
        }
      })
    });
    
  }
  getAvis(){
    this.avis.subscribe(avis =>{
      avis.forEach( unAvis =>{
        if(unAvis['destinataire']==this.userid){
          this.nbAvis+=1;
          this.avisValue+=unAvis['note'];
          this.avisTotal = (this.avisValue / this.nbAvis)
          //console.log(this.avisTotal.toString().indexOf('.'))
          if(this.avisTotal.toString().indexOf('.') != -1){
            this.avisTotal=this.avisTotal.toFixed(2);
          }
        }
      })
      
    })
    
  }
 
  getImagesStorage(image: any) {
    this.afSG.ref('users/'+image).getDownloadURL().subscribe(imgUrl => {
      this.images= imgUrl;
    });
  }
 
  returnConnected(){
    return this.connected;
  }

  
}
