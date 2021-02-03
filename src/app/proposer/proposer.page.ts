import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgForOf } from '@angular/common';
import {LoadingController, ToastController, NavController} from '@ionic/angular';
import {trajets} from '../models/trajets.model';
import {utilisateur_trajet} from '../models/utilisateur_trajet.model';
import { AlertController } from '@ionic/angular';
import {etapes} from '../models/etapes.model';

@Component({
  selector: 'app-proposer',
  templateUrl: './proposer.page.html',
  styleUrls: ['./proposer.page.scss'],
})
export class ProposerPage implements OnInit{
  trajet = {tra_lieuDepart:"", tra_lieuArrivee:""} as trajets;
  utilisateurTrajet = {} as utilisateur_trajet;
  etape = {} as etapes;
  messages: Observable<any[]>;
  users: Observable<any[]>;
  today = new Date();

  beforeClick :boolean = true;

  public proposerView : Observable<any[]>;
  public userList = Array();
  public userList2 = Array();

  public connected= false;
  public userId;
  public destId;
  id;// id trajet

  showvilleDepart=false;
  disabledDepart;

  showvilleArrivee=false;
  disabledArrivee;

  Tra_lieuDepartBIS="";
  Tra_lieuArriveeBIS="";

  liste_depart;
  liste_arrivee;
  
  constructor(
    public alertController: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    public afAuth: AngularFireAuth,
    public firestore: AngularFirestore,
    public afDB: AngularFireDatabase,
    private router: Router
  ) {

    this.liste_depart=[{nom:''}]
    this.liste_arrivee=[{nom:''}]

    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        this.router.navigateByUrl('/connexion');
        this.connected = false;
      } else {
        this.userId = auth.uid;
        this.connected = true;
        this.users = this.firestore.collection("utilisateurs").valueChanges();
        this.id = new Date().toISOString();
        
      }});
      
    
  }
  ngOnInit() {}
  async createTrajets(trajet: trajets) {
    // console.log(post);
    trajet.tra_id = this.id;
    if (this.formValidation()) {
      // console.log("ready to submit");

      // show loader
      const loader = this.loadingCtrl.create({
        message: 'Veuillez patienter...'
      });
      await (await loader).present();

      try {
        await this.firestore.collection('trajets').add(trajet);
      } catch (e) {
        this.showToast(e);
      }

      // dismiss loader
      await (await loader).dismiss();

      // redirect to home page
      this.navCtrl.navigateRoot('tabs/tableaubord');
    }

    
  }

heure(utilisateurTrajet: utilisateur_trajet,trajet: trajets){
  if(this.trajet.tra_heureDepart > this.trajet.tra_heureArrivee ){
    this.showToast("L'heure d'arrivée ne peut pas être inférieur à celle de départ !");
  }
  else{
    this.date(utilisateurTrajet,trajet);
  }
}

  date(utilisateurTrajet: utilisateur_trajet,trajet: trajets){
    var date1 = this.trajet.tra_dateDepart;
    var date = new Date (date1);
    var newDate = date ;
    console.log("tratra"+newDate);
    console.log("trotro"+this.today);
    if( newDate.getDay() < this.today.getDay() && newDate.getMonth() < this.today.getMonth() && newDate.getFullYear() < this.today.getFullYear()){
      this.showToast("Merci de rentrer une date ultérieur à celle d'aujourd'hui !");
    }
    else{
      this.LancerFonction(utilisateurTrajet,trajet);
      
  }}

  async createUtilisateur_trajet(utilisateurTrajet: utilisateur_trajet) {
    // console.log(post);
    utilisateurTrajet.uti_tra_idUti = this.userId;
    utilisateurTrajet.uti_tra_idTra = this.id;
    utilisateurTrajet.uti_tra_role = "Conducteur";
    if (this.formValidation()) {
      // console.log("ready to submit");

      // show loader
      const loader = this.loadingCtrl.create({
        message: 'Veuillez patienter...'
      });
      await (await loader).present();

      try {
        await this.firestore.collection('utilisateur_trajet').add(utilisateurTrajet);
      } catch (e) {
        this.showToast(e);
      }

      // dismiss loader
      await (await loader).dismiss();

      // redirect to home page
      this.navCtrl.navigateRoot('tabs/tableaubord');
    }}

  formValidation() {
    if (!this.trajet.tra_lieuArrivee) {
      // show toast message
      this.showToast('Entrez un lieu de départ');
      return false;
    }

    if (!this.trajet.tra_lieuDepart) {
      // show toast message
      this.showToast('Entrez un lieu d\'arrivée');
      return false;
    }

    return true;
  }

  showToast(message: string) {
    this.toastCtrl
        .create({
          message,
          duration: 3000
        })
        .then(toastData => toastData.present());
  }

  LancerFonction(utilisateurTrajet: utilisateur_trajet,trajet: trajets){
    
    this.createUtilisateur_trajet(utilisateurTrajet);
    this.createTrajets(trajet);
  }
  
  async presentAlertConfirm(utilisateurTrajet: utilisateur_trajet,trajet: trajets) {
    const alert = await this.alertController.create({
      header: 'Confirmation de trajet !',
      message: `<p><strong>LIEU DE DEPART : </strong>`+this.trajet.tra_lieuDepart+`</p>`+
      `<p><strong>DATE DE DEPART : </strong>`+this.trajet.tra_dateDepart+`</p>`+
      `<p><strong>HEURE DE DEPART : </strong>`+this.trajet.tra_heureDepart+`</p>`+
      `<p><strong>LIEU D'ARRIVEE : </strong>`+this.trajet.tra_lieuArrivee+`</p>`+
      `<p><strong>HEURE D'ARRIVEE : </strong>`+this.trajet.tra_heureArrivee+`</p>`+
      `<p><strong>LES ETAPES : </strong>`+this.trajet.tra_etape+`</p>`,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Confirmer',
          handler: () => {
            this.LancerFonction(utilisateurTrajet,trajet);
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

addEtape(etape: etapes){
  this.beforeClick = false;
  this.createEtape(etape)}

async createEtape(etape: etapes ) {
  // console.log(post);
  etape.eta_id = this.userId;
  etape.eta_idTra = this.id;
  etape.eta_ville = this.etape.eta_ville;
  if (this.etape.eta_ville != "") {
    // console.log("ready to submit");

    // show loader
    const loader = this.loadingCtrl.create({
      message: 'Veuillez patienter...'
    });
    await (await loader).present();

    try {
      await this.firestore.collection('etapes').add(etape);
    } catch (e) {
      this.showToast(e);
    }

    // dismiss loader
    await (await loader).dismiss();

    // redirect to home page
    this.navCtrl.navigateRoot('tabs/tableaubord');
  }}

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
    this.trajet.tra_lieuDepart=val.nom;
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
    this.trajet.tra_lieuDepart="";
    this.Tra_lieuDepartBIS = "";
  
    this.disabledDepart=false;
  }
  
  isDisabledDepart(){
    //console.log(this.trajet.tra_lieuDepart);
    if(this.trajet.tra_lieuDepart!=""){
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
  this.trajet.tra_lieuArrivee=val.nom;
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
  this.trajet.tra_lieuArrivee="";
  this.Tra_lieuArriveeBIS = "";

  this.disabledArrivee=false;
}

isDisabledArrivee(){
  //console.log(this.trajet.tra_lieuDepart);
  if(this.trajet.tra_lieuArrivee!=""){
    this.disabledArrivee=true;
    return true;
  }else{
    this.disabledArrivee=false;
    return false;
  }
}
}



