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

  today;

  datemax;

  
  utilisateurs: Observable<any[]>;
  trajets: Observable<any[]>;
  uti_tras: Observable<any[]>;
  public trajet_a_venir : [] = [];
  public trajet_a_venir2 : []= [];
  liste_dates = [];
  liste_trajetdispo = [];

  public images = "";
  
  public trajetprevus :boolean = false;

  public trajettrouve : boolean = false;

  public trajet;
  public uti_tra;
  public uti;

  showvilleDepart=false;
  disabledDepart;

  showvilleArrivee=false;
  disabledArrivee;

  Tra_lieuDepart="";
  Tra_lieuDepartBIS="";
  liste_depart;

  Tra_lieuArrivee="";
  Tra_lieuArriveeBIS="";
  liste_arrivee;

  Tra_dateDepart: string;

  Tra_heureDepart: string;

  //tra_nbPassager: string;

  test;

  listeUser_Photo = []

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
    this.uti_tras = firestore.collection('utilisateur_trajet').valueChanges();
    this.utilisateurs = firestore.collection('utilisateurs').valueChanges();

    this.liste_depart=[{nom:''}]
    this.liste_arrivee=[{nom:''}]

    this.today = new Date();
    this.today = this.formatDate(this.today)

    this.datemax= new Date();
    this.datemax.setDate(this.datemax.getDate()+360);
    this.datemax = this.formatDate(this.datemax)

    //this.getListUsers()

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

formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}
getImagesStorage(traj, uti) {
  var that = this;
  var img = uti['photo'];
  this.afSG.ref('users/'+img).getDownloadURL().subscribe(imgUrl => {
    that.liste_trajetdispo.push({trajet:traj, utilisateur:uti, photo:imgUrl});
  });
}

getListUsers(){
  var that = this;
  this.utilisateurs.subscribe(utis =>{
    utis.forEach(uti => {
      //that.getImagesStorage(uti["photo"],uti.id);
      //console.log('photo : ',photo)
    });
  })
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

var that = this;



/* this.trajet.subscribe(tra =>{
  tra.forEach(traj=> { */



    that.test = that.firestore.collection("trajets");
    that.test.ref.orderBy('tra_dateDepart')
    .onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
    console.log(doc.data())
    //console.log(traj['tra_lieuDepart']+"/////" + this.Tra_lieuDepart)
    //console.log(traj['tra_dateDepart'] +"/////"+ this.Tra_dateDepart.slice(0,-19));
    //console.log(traj['tra_lieuArrivee']+ "/////" + this.Tra_lieuArrivee );
    if(doc.data()['tra_lieuDepart'] == that.Tra_lieuDepart && doc.data()['tra_lieuArrivee'] == that.Tra_lieuArrivee && doc.data()['tra_dateDepart'] == that.Tra_dateDepart.slice(0,-19)){
      var date = new Date(doc.data()['tra_dateDepart'])
      if(date >= new Date){

        console.log(doc.data()['tra_id'])

        that.uti_tras.subscribe(uti_tras => {
          uti_tras.forEach(uti_tra =>{

            if(uti_tra["uti_tra_idTra"]==doc.data()['tra_id']){

              that.utilisateurs.subscribe(utis =>{
                utis.forEach(uti =>{

                  if(uti_tra["uti_tra_idUti"]==uti['id'] && uti_tra["uti_tra_role"]=="Conducteur"){

                    that.getImagesStorage(doc.data(),uti);
                    that.trajettrouve = true;
                    that.changement();
                  }

                })
              })
            }
          })
        })
      }
    }
  })})

}

redirectiontrajettrouve(){
  if(this.trajettrouve == true){
  }
  else{
    this.errorValue("Aucun trajet trouvé !")
  }
}

fonctionstrouvertrajets(){
  this.recherche();
  this.redirectiontrajettrouve();
}

changement(){
    this.beforesearch=false;
}

getVilleDepart(event){
  if(this.Tra_lieuDepartBIS.trim()==""){
    this.Tra_lieuDepartBIS="";
  }
  const apiUrl2 = 'https://geo.api.gouv.fr/communes?nom='
  const format = '&format=json';
  
  let Tra_lieuDepartBIS = event;
  //let ville = this.user.ville;
  let url2 = apiUrl2+Tra_lieuDepartBIS+'&limit=3'+format;


    fetch(url2, {method: 'get'}).then(response => response.json()).then(results => {
      this.liste_depart=results
      console.log(results);
      
      
    }).catch(err => {
      this.liste_depart=[{nom:''}]
      console.log(err);
    });
}

addVilleDepart(val){
  this.Tra_lieuDepart=val.nom;
  this.Tra_lieuDepartBIS = val.nom;
  
  this.showvilleDepart=false;
  this.disabledDepart=true;
}

showVilleDepart(val){
  if(this.disabledDepart==false){
    this.showvilleDepart=val;
  }
}

suppVilleDepart(){
  this.Tra_lieuDepart="";
  this.Tra_lieuDepartBIS = "";

  this.disabledDepart=false;
}

isDisabledDepart(){
  if(this.Tra_lieuDepart!=""){
    this.disabledDepart=true;
    return true;
  }else{
    this.disabledDepart=false;
    return false;
  }
}

getVilleArrivee(event){
  if(this.Tra_lieuArriveeBIS.trim()==""){
    this.Tra_lieuArriveeBIS="";
  }
  const apiUrl2 = 'https://geo.api.gouv.fr/communes?nom='
  const format = '&format=json';
  
  let Tra_lieuArriveeBIS = event;
  //let ville = this.user.ville;
  let url2 = apiUrl2+Tra_lieuArriveeBIS+'&limit=3'+format;


    fetch(url2, {method: 'get'}).then(response => response.json()).then(results => {
      this.liste_arrivee=results
      console.log(results);
      
      
    }).catch(err => {
      this.liste_arrivee=[{nom:''}]
      console.log(err);
    });
}

addVilleArrivee(val){
  this.Tra_lieuArrivee=val.nom;
  this.Tra_lieuArriveeBIS = val.nom;
  
  this.showvilleArrivee=false;
  this.disabledArrivee=true;
}

showVilleArrivee(val){
  if(this.disabledArrivee==false){
    this.showvilleArrivee=val;
  }
  
}

suppVilleArrivee(){
  this.Tra_lieuArrivee="";
  this.Tra_lieuArriveeBIS = "";

  this.disabledArrivee=false;
}

isDisabledArrivee(){
  //console.log(this.Tra_lieuDepart);
  if(this.Tra_lieuArrivee!=""){
    this.disabledArrivee=true;
    return true;
  }else{
    this.disabledArrivee=false;
    return false;
  }
}

retour(){
  this.beforesearch=true;
}

suppValue(){
  this.suppVilleDepart();
  this.suppVilleArrivee();
  this.Tra_dateDepart="";
  this.liste_trajetdispo=[];
  this.beforesearch=true;
}


}




 
 
  




