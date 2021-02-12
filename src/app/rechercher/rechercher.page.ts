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
import { LoadingController } from '@ionic/angular';


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
  etapes: Observable<any[]>;
  uti_tras: Observable<any[]>;
  public trajet_a_venir : [] = [];
  public trajet_a_venir2 : []= [];
  liste_dates = [];
  liste_trajetdispo = [];

  public images = "";
  
  public trajetprevus :boolean = false;

  public trajettrouve : boolean = false;

  public etape;
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
  test2;
  test3;

  listeUser_Photo = []

dataUser = {
  email: '',
  password: ''
};
beforesearch:boolean = true;

connected: boolean;


  constructor(
    public loadingController: LoadingController,
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
    this.etape = firestore.collection('etapes').valueChanges();

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
        //console.log('non connecté');
        this.connected = false;
      } else {
        this.userid = auth.uid;
        //console.log('connecté: ' + auth.uid);
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

getImagesStorage(traj, uti, liste_trajetdispo,nbplace) {
  var that = this;
  var liste = liste_trajetdispo
  var nb = 0;
  
  var img = uti['photo'];
  console.log('liste trajet : ',liste,liste.length )
  this.afSG.ref('users/'+img).getDownloadURL().subscribe(imgUrl => {
    
     var test = that.firestore.collection("utilisateur_trajet");

    console.log(traj['tra_id'])
    var utiId="";
  
   
    test.ref.where("uti_tra_idTra","==",traj['tra_id']).onSnapshot(function(trajettt){
      trajettt.forEach(function(untrajet){
        console.log('//////////////////////')
        nb = nb + 1;
        console.log('nb : ',nb)
        console.log(untrajet.data()['uti_tra_idUti'],"///",that.userid)
        if(untrajet.data()['uti_tra_idUti']==that.userid){
          console.log("passage")
          utiId="deja"
        }
      })
      console.log(nb)
      
    if(utiId!="deja"){
      if(nb < nbplace){
      
        if(!liste.includes({trajet:traj, utilisateur:uti, photo:imgUrl})){
          liste.push({trajet:traj, utilisateur:uti, photo:imgUrl});
          that.trajettrouve = true;
        }
      }
      
    }

    
    })
    
  });
  return liste;
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


async showHideAutoLoader() {

  const loading = await this.loadingController.create({
    message: 'Recherche en cours...',
    duration: 2000
  });
  await loading.present();

  const { role, data } = await loading.onDidDismiss();
  console.log('Loading dismissed! after 2 Seconds', { role, data });
  if(this.trajettrouve == true){
    this.changement();
  }else{
    this.errorValue("Aucun trajet trouvé !")
  }
  
}

recherche(){
  
this.liste_trajetdispo = [];
this.beforesearch=true;
this.trajettrouve=false;
var liste = this.liste_trajetdispo;

var that = this;



/* this.trajet.subscribe(tra =>{
  tra.forEach(traj=> { */




    that.test = that.firestore.collection("trajets");
    that.test.ref.orderBy('tra_dateDepart')
    .onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
    //console.log(doc.data())

    that.test2 = that.firestore.collection("etapes");
    that.test2.ref.onSnapshot(function(querySnapshot2) {
        querySnapshot2.forEach(function(doc2) {
    //console.log(doc.data())

    that.test3 = that.firestore.collection("etapes");
    that.test3.ref.onSnapshot(function(querySnapshot3) {
        querySnapshot3.forEach(function(doc3) {
    //console.log(doc.data())
    //console.log(traj['tra_lieuDepart']+"///" + this.Tra_lieuDepart)
    //console.log(traj['tra_dateDepart'] +"///"+ this.Tra_dateDepart.slice(0,-19));
    //console.log(traj['tra_lieuArrivee']+ "///" + this.Tra_lieuArrivee );
    if((doc.data()['tra_lieuDepart'] == that.Tra_lieuDepart && doc.data()['tra_lieuArrivee'] == that.Tra_lieuArrivee && doc.data()['tra_dateDepart'] == that.Tra_dateDepart.slice(0,-19))
    || (doc.data()['tra_lieuDepart'] == that.Tra_lieuDepart && (doc2.data()['eta_ville'] == that.Tra_lieuArrivee && doc2.data()['eta_idTra']==doc.data()['tra_id']) && doc.data()['tra_dateDepart'] == that.Tra_dateDepart.slice(0,-19))
    || (doc2.data()['eta_ville'] == that.Tra_lieuDepart && doc2.data()['eta_idTra']==doc.data()['tra_id']) && doc.data()['tra_lieuArrivee'] == that.Tra_lieuArrivee && doc.data()['tra_dateDepart'] == that.Tra_dateDepart.slice(0,-19)
    || (doc2.data()['eta_ville'] == that.Tra_lieuDepart && doc3.data()['eta_ville'] == that.Tra_lieuArrivee  && doc.data()['tra_dateDepart'] == that.Tra_dateDepart.slice(0,-19) && doc3.data()['eta_idTra'] == doc2.data()['eta_idTra'] && doc3.data()['eta_idTra'] == doc.data()['tra_id'] && doc2.data()['eta_idTra'] == doc.data()['tra_id'])){
      var date = new Date(doc.data()['tra_dateDepart'])
      if(date >= new Date){

        //console.log(doc.data()['etapes.eta_ville'])

        that.uti_tras.subscribe(uti_tras => {
          uti_tras.forEach(uti_tra =>{

            if(uti_tra["uti_tra_idTra"]==doc.data()['tra_id']){

              that.utilisateurs.subscribe(utis =>{
                utis.forEach(uti =>{

                  if(uti['id'] != that.userid && uti_tra["uti_tra_idUti"]==uti['id'] && uti_tra["uti_tra_role"]=="Conducteur"){

                    liste = that.getImagesStorage(doc.data(),uti,liste,doc.data()['tra_nbPlaces']);
                  
                    
                    
                    
                  }

                })
              })
            }
          })
        })
      }

    }
  })})
  })})
  })})
  that.showHideAutoLoader();
  that.liste_trajetdispo = liste;
}

ngOnInit(){
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
      //console.log(results);
      
      
    }).catch(err => {
      this.liste_depart=[{nom:''}]
      //console.log(err);
    });
}

addVilleDepart(val){
  this.Tra_lieuDepart=val.nom;
  this.Tra_lieuDepartBIS = val.nom;
  
  this.showvilleDepart=false;
  this.disabledDepart=true;

  this.Tra_lieuArrivee = "Lycée Jean Rostand";
  this.Tra_lieuArriveeBIS = "Lycée Jean Rostand";
  
  this.showvilleArrivee=false;
  this.disabledArrivee=true;
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

  this.Tra_lieuArrivee="";
  this.Tra_lieuArriveeBIS = "";

  this.disabledArrivee=false;
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
      //console.log(results);
      
      
    }).catch(err => {
      this.liste_arrivee=[{nom:''}]
      //console.log(err);
    });
}

addVilleArrivee(val){
  this.Tra_lieuArrivee=val.nom;
  this.Tra_lieuArriveeBIS = val.nom;
  
  this.showvilleArrivee=false;
  this.disabledArrivee=true;

  this.Tra_lieuDepart="Lycée Jean Rostand";
  this.Tra_lieuDepartBIS = "Lycée Jean Rostand";
  
  this.showvilleDepart=false;
  this.disabledDepart=true;
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

  this.Tra_lieuDepart="";
  this.Tra_lieuDepartBIS = "";

  this.disabledDepart=false;
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




 
 
  




