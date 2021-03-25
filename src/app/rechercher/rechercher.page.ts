import { Component, OnInit  } from '@angular/core';
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

  // id
  public userid;


  // Date pour recherche
  today;
  datemax;

  // Variable pour afficher
  utilisateurs: Observable<any[]>;
  trajets: Observable<any[]>;
  etapes: Observable<any[]>;
  uti_tras: Observable<any[]>;

  // Liste qui servira à afficher les trajets 
  liste_trajetdispo = [];
  liste_trajetdispo_id = [];
  
  public trajettrouve : boolean = false;

  // Déclaration des variables pour les boucles
  public etape;
  public trajet;
  public uti_tra;
  public uti;

  //Variable pour afficher les villes, bloquer la saisie
  showvilleDepart=false;
  disabledDepart;

  showvilleArrivee=false;
  disabledArrivee;

  // Double variables : variable de saisie du champ ET une variable de sécurité après avoir choisi le lieu ( si une personne modifie)
  Tra_lieuDepart="";
  Tra_lieuDepartBIS="";

  //Liste des lieux que l'API proposera
  liste_depart;

  Tra_lieuArrivee="";
  Tra_lieuArriveeBIS="";
  liste_arrivee;

  Tra_dateDepart: string;

  // Variable pour de futur collection BDD
  traj;
  etape1;
  etape2;

  
  listeUser_Photo = []

  beforesearch:boolean = true;


  constructor(
    public loadingController: LoadingController,
    private router: Router,
    public toastController: ToastController,
    public afAuth: AngularFireAuth,
    public afDB: AngularFireDatabase,
    public firestore: AngularFirestore,
    public afSG: AngularFireStorage
  ) {

    // Liste que l'API nous proposera
    this.liste_depart=[{nom:''}]
    this.liste_arrivee=[{nom:''}]


    // Date pour les recherches ( de aujourd'hui à l'année prochaine max )
    this.today = new Date();
    this.today = this.formatDate(this.today)

    this.datemax= new Date();
    this.datemax.setDate(this.datemax.getDate()+360);
    this.datemax = this.formatDate(this.datemax)

    // Est-ce qu'on est connecté ?
    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        this.router.navigateByUrl('/connexion');
      } else {
        this.userid = auth.uid;
      }
    });

}

//Fonction pour avoir le format yyyy-mm-dd
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

// Fonction avec plusieurs fonctionnalités 
getImagesStorage(traj, uti, liste_trajetdispo,nbplace) {
  var that = this;
  var liste = liste_trajetdispo
  var nb = 0;

  // On va récupérer la photo de l'utilisateur
  var img = uti['photo'];
  //console.log('liste trajet : ',liste,liste.length )
  this.afSG.ref('users/'+img).getDownloadURL().subscribe(imgUrl => {
    
    var uti_tra = that.firestore.collection("utilisateur_trajet");
    var utiId="";

    //On va compter combien de personne on réservait
    uti_tra.ref.where("uti_tra_idTra","==",traj['tra_id']).onSnapshot(function(trajettt){
      trajettt.forEach(function(untrajet){
        nb = nb + 1;
        if(untrajet.data()['uti_tra_idUti']==that.userid){ // Est-ce que j'ai déjà réservé ?
          utiId="deja"
        }
      })
      
      if(utiId!="deja"){
        if(nb <= nbplace){
        
          var inclus = that.liste_trajetdispo_id.includes(traj['tra_id']) //On vérifie si le trajet n'est pas dans la liste à afficher
          if(inclus==false){
            that.liste_trajetdispo_id.push(traj['tra_id'])
            liste.push({trajet:traj, utilisateur:uti, photo:imgUrl});
            that.trajettrouve = true;
          }
        }
      }
    })
  });
  return liste;
}

// Fonction message erreur
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


// Animation de recherche
async showHideAutoLoader() {

  const loading = await this.loadingController.create({
    message: 'Recherche en cours...',
    duration: 2000
  });
  await loading.present();

  const { role, data } = await loading.onDidDismiss();
  if(this.trajettrouve == true){
    this.changement();
  }else{
    this.errorValue("Aucun trajet trouvé !")
  }
  
}

recherche(){
  
this.liste_trajetdispo = [];
this.liste_trajetdispo_id = [];

this.beforesearch=true;
this.trajettrouve=false;
var liste = this.liste_trajetdispo;

var that = this;

  that.traj = that.firestore.collection("trajets");
  that.traj.ref.orderBy('tra_dateDepart')
  .onSnapshot(function(querySnapshot) {
    querySnapshot.forEach(function(doc) { //On parcours tous les trajets

    that.etape1 = that.firestore.collection("etapes");
    that.etape1.ref.onSnapshot(function(querySnapshot2) {
      querySnapshot2.forEach(function(doc2) { //On parcours les étapes

        that.etape2 = that.firestore.collection("etapes");
        that.etape2.ref.onSnapshot(function(querySnapshot3) { //On parcours les étapes une deuxième fois ( pour étape vers étape )
          querySnapshot3.forEach(function(doc3) {
            if(((doc.data()['tra_villeDepart'] == that.Tra_lieuDepart || doc.data()['tra_lieuDepart'] == that.Tra_lieuDepart ) && (doc.data()['tra_villeArrivee'] == that.Tra_lieuArrivee || doc.data()['tra_lieuArrivee'] == that.Tra_lieuArrivee) && doc.data()['tra_dateDepart'] == that.Tra_dateDepart.slice(0,-19))
              || (doc.data()['tra_villeDepart'] == that.Tra_lieuDepart && (doc2.data()['eta_ville'] == that.Tra_lieuArrivee && doc2.data()['eta_idTra']==doc.data()['tra_id']) && doc.data()['tra_dateDepart'] == that.Tra_dateDepart.slice(0,-19))
              || (doc2.data()['eta_ville'] == that.Tra_lieuDepart && doc2.data()['eta_idTra']==doc.data()['tra_id']) && doc.data()['tra_villeArrivee'] == that.Tra_lieuArrivee && doc.data()['tra_dateDepart'] == that.Tra_dateDepart.slice(0,-19)
              || (doc2.data()['eta_ville'] == that.Tra_lieuDepart && doc3.data()['eta_ville'] == that.Tra_lieuArrivee  && doc.data()['tra_dateDepart'] == that.Tra_dateDepart.slice(0,-19) && doc3.data()['eta_idTra'] == doc2.data()['eta_idTra'] && doc3.data()['eta_idTra'] == doc.data()['tra_id'] && doc2.data()['eta_idTra'] == doc.data()['tra_id'])){
                
                var date = new Date(doc.data()['tra_dateDepart'])
                  if(date >= new Date){ //Est ce que les trajets est plus tard ou il est aujourd'hui
                    that.uti_tras.subscribe(uti_tras => { //On parcourt les uti_tra
                      uti_tras.forEach(uti_tra =>{
                        if(uti_tra["uti_tra_idTra"]==doc.data()['tra_id']){ // Est-ce que l'id de uti_tra correspond à ce trajet
                          that.utilisateurs.subscribe(utis =>{
                            utis.forEach(uti =>{
                              if(uti['id'] != that.userid && uti_tra["uti_tra_idUti"]==uti['id'] && uti_tra["uti_tra_role"]=="Conducteur"){ // On récupère l'utilisateur qui est conducteur de ce trajet
                                liste = that.getImagesStorage(doc.data(),uti,liste,doc.data()['tra_nbPlaces']); // On va effectuer plusieurs actions avec ces valeurs
                              }
                            })
                          })
                        }
                      })
                    })
                  }
                }
              })
            })
          })
        })
      })
    })
  that.showHideAutoLoader(); // On anime la recherche
  that.liste_trajetdispo = liste;
}

ngOnInit(){
}


fonctionstrouvertrajets(){
  this.recherche();
}

// Fonction qui va changer l'apparence de la page lorsqu'il y a un trajet à afficher
changement(){
    this.beforesearch=false;
}

// On récupère les villes avec une API.
getVilleDepart(event){
  if(this.Tra_lieuDepartBIS.trim()==""){
    this.Tra_lieuDepartBIS="";
  }
  const apiUrl2 = 'https://geo.api.gouv.fr/communes?nom='
  const format = '&format=json';
  
  let Tra_lieuDepartBIS = event;
  let url2 = apiUrl2+Tra_lieuDepartBIS+'&limit=3'+format;

    fetch(url2, {method: 'get'}).then(response => response.json()).then(results => {
      this.liste_depart=results
    }).catch(err => {
      this.liste_depart=[{nom:''}]
    });
}

// On ajoute les valeurs dans les variables
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

// On affiche les villes que l'API nous propose ?
showVilleDepart(val){
  if(this.disabledDepart==false){
    this.showvilleDepart=val;
  }
}

//On supprime toutes les valeurs de départ
suppVilleDepart(){
  this.Tra_lieuDepart="";
  this.Tra_lieuDepartBIS = "";

  this.disabledDepart=false;

  this.Tra_lieuArrivee="";
  this.Tra_lieuArriveeBIS = "";

  this.disabledArrivee=false;
}

// Est-ce qu'on peut cliquer sur le champ ?
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
  let url2 = apiUrl2+Tra_lieuArriveeBIS+'&limit=3'+format;

  fetch(url2, {method: 'get'}).then(response => response.json()).then(results => {
    this.liste_arrivee=results

  }).catch(err => {
    this.liste_arrivee=[{nom:''}]
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
  if(this.Tra_lieuArrivee!=""){
    this.disabledArrivee=true;
    return true;
  }else{
    this.disabledArrivee=false;
    return false;
  }
}


// On affiche à nouveau les champs à saisir
retour(){
  this.beforesearch=true;
}

//On supprime toutes les valeurs
suppValue(){
  this.suppVilleDepart();
  this.suppVilleArrivee();
  this.Tra_dateDepart="";
  this.liste_trajetdispo=[];
  this.liste_trajetdispo_id = [];

  this.beforesearch=true;
}
}




 
 
  




