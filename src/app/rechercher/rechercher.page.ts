import { Component, OnInit  } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';

import { AngularFireDatabase } from '@angular/fire/database';

import {AngularFirestore} from '@angular/fire/firestore';

import { AngularFireAuth } from '@angular/fire/auth';

import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-rechercher',
  templateUrl: 'rechercher.page.html',
  styleUrls: ['rechercher.page.scss']
})



export class RechercherPage {
  public userid;
  public destId;

  public destView = {
    nom: '',
    prenom: ''
  };

  lieudepartRemplacé: string;

  today = new Date();
  utilisateurs: Observable<any[]>;
  trajets: Observable<any[]>;
  uti_tra: Observable<any[]>;
  public trajet_a_venir : [] = [];
  public trajet_a_venir2 : []= [];
  liste_dates = [];
  liste_trajetdispo = [];

  public images = "";
  
  public trajetprevus :boolean = false;

  public trajettrouve : boolean = false;

  public trajet;
  Tra_lieuDepart: string;
  Tra_lieuArrivee: string;
  Tra_dateDepart: string;
  Tra_heureDepart: string;
  //tra_nbPassager: string;

dataUser = {
  email: '',
  password: ''
};
beforesearch:boolean = true;

connected: boolean;


  constructor(
    private router: Router,
    public toastController: ToastController,
    public afAuth: AngularFireAuth,
    public afDB: AngularFireDatabase,
    public firestore: AngularFirestore,
    public afSG: AngularFireStorage
  ) {
    
    this.trajet = firestore.collection('trajets').valueChanges();

    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        console.log('non connecté');
        this.connected = false;
      } else {
        console.log('connecté: ' + auth.uid);
        this.connected = true;
      }
    });

}


async errorValue(messages) {
  const toast = await this.toastController.create({
    message: messages,
    duration: 2000,
    animated: true,
    position: 'bottom',
    cssClass: 'toast-error',

  });
  await toast.present();
}




recherche(){
  
this.liste_trajetdispo = [];
this.beforesearch=true;
this.trajet.subscribe(tra =>{
tra.forEach(traj=> {
/*console.log("ok")
console.log(traj['tra_lieuDepart']+"/////" + this.Tra_lieuDepart)
console.log(traj['tra_dateDepart'] +"/////"+ this.Tra_dateDepart.slice(0,-19));
console.log(traj['tra_lieuArrivee']+ "/////" + this.Tra_lieuArrivee );*/
if(traj['tra_lieuDepart'] == this.Tra_lieuDepart 
&& traj['tra_lieuArrivee'] == this.Tra_lieuArrivee 
&& traj['tra_dateDepart'] == this.Tra_dateDepart.slice(0,-19))
{
  if(traj['tra_dateDepart'] <= this.today){
    this.trajettrouve = true;
  this.changement();
  this.liste_trajetdispo.push({lieudepart:traj['tra_lieuDepart'], heuredepart:traj['tra_heureDepart'], lieuarrivee:traj['tra_lieuArrivee'], heurearrivee:traj['tra_heureArrivee'], datedepart:traj['tra_dateDepart'],});
}
}
    })
  })
}

redirectiontrajettrouve(){
  if(this.trajettrouve == true){
  }
  else{
    this.errorValue("Aucun trajet trouvé !")
  }
}

fonctionstrouvertrajets(){
  this.remplacer();
  this.recherche();
  this.redirectiontrajettrouve();
}




changement(){
    this.beforesearch=false;
}




remplacer(){
  var regAccentA = new RegExp('[àâäã]', 'gi');
  var regAccentE = new RegExp('[éèêë]', 'gi');
  var regAccentU = new RegExp('[ùûü]', 'gi');
  var regAccentI = new RegExp('[îïì]', 'gi');
  var regAccentO = new RegExp('[ôöõò]', 'gi');
  var regAccentY = new RegExp('[ÿ]', 'gi');
  var regAccentC = new RegExp('[ç]', 'gi');
  var regAccentOE = new RegExp('[œ]', 'gi');
  var regAccentAE = new RegExp('[æ]', 'gi');
  var regAccentN = new RegExp('[ñ]', 'gi');

  
  var myString;
  var myStringUP;
  
 // console.log(myString)
  //console.log(mystring2);

  // Application de la fonction replace() sur myString

  myString = this.Tra_lieuDepart.replace(regAccentA, 'a');
  myString = myString.replace(regAccentE, 'e');
  myString = myString.replace(regAccentU, 'u');
  myString = myString.replace(regAccentI, 'i');
  myString = myString.replace(regAccentO, 'o');
  myString = myString.replace(regAccentY, 'y');
  myString = myString.replace(regAccentC, 'c');
  myString = myString.replace(regAccentOE, 'oe');
  myString = myString.replace(regAccentAE, 'ae');
  myString = myString.replace(regAccentN, 'n');
 

  myString = myString.replace(/[^a-zA-Z- ]/g,'');
  myStringUP = myString.trim();
  this.Tra_lieuDepart = myStringUP.toLowerCase();
 // console.log('depart : '+this.Tra_lieuDepart);
  

      var mystring2;
      var mystring2UP;


      mystring2 = this.Tra_lieuArrivee.replace(regAccentA, 'a');
      mystring2 = mystring2.replace(regAccentE, 'e');
      mystring2 = mystring2.replace(regAccentU, 'u');
      mystring2 = mystring2.replace(regAccentI, 'i');
      mystring2 = mystring2.replace(regAccentO, 'o');
      mystring2 = mystring2.replace(regAccentY, 'y');
      mystring2 = mystring2.replace(regAccentC, 'c');
      mystring2 = mystring2.replace(regAccentOE, 'oe');
      mystring2 = mystring2.replace(regAccentAE, 'ae');
      mystring2 = mystring2.replace(regAccentN, 'n');
  
      mystring2 = mystring2.replace(/[^a-zA-Z- ]/g,'');
      mystring2UP = mystring2.trim();
      this.Tra_lieuArrivee = mystring2UP.toLowerCase();

      //console.log('arrivée : '+this.Tra_lieuArrivee);
}


}




 
 
  




