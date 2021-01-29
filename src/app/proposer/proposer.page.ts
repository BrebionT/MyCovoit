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

@Component({
  selector: 'app-proposer',
  templateUrl: './proposer.page.html',
  styleUrls: ['./proposer.page.scss'],
})
export class ProposerPage implements OnInit{
  trajet = {} as trajets;
  utilisateurTrajet = {} as utilisateur_trajet;
  messages: Observable<any[]>;
  users: Observable<any[]>;
  today = new Date();

  public proposerView : Observable<any[]>;
  public userList = Array();
  public userList2 = Array();

  public connected= false;
  public userId;
  public destId;
  
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
    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        this.router.navigateByUrl('/connexion');
        this.connected = false;
      } else {
        this.userId = auth.uid;
        this.connected = true;
        this.users = this.firestore.collection("utilisateurs").valueChanges();
        
        
      }});
      
    
  }
  ngOnInit() {}
  async createTrajets(trajet: trajets,id) {
    // console.log(post);
    trajet.tra_id = id;
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

  async createUtilisateur_trajet(utilisateurTrajet: utilisateur_trajet,id, ) {
    // console.log(post);
    utilisateurTrajet.uti_tra_idUti = this.userId;
    utilisateurTrajet.uti_tra_idTra = id;
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
    var id = new Date().toISOString();
    this.remplacer();
    this.createUtilisateur_trajet(utilisateurTrajet, id);
    this.createTrajets(trajet, id);
  }
  
  async presentAlertConfirm(utilisateurTrajet: utilisateur_trajet,trajet: trajets,today) {
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
    var myStringUP2;
    
    console.log(myString)
    console.log(mystring2);
  
    // Application de la fonction replace() sur myString
  
    myString = this.trajet.tra_lieuDepart.replace(regAccentA, 'a');
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
    this.trajet.tra_lieuDepart = myStringUP.toLowerCase();
    console.log('depart : '+this.trajet.tra_lieuDepart);
    
  
        var mystring2;
        var mystring2UP;
        var mystring2UP2;
  
  
        mystring2 = this.trajet.tra_lieuArrivee.replace(regAccentA, 'a');
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
        this.trajet.tra_lieuArrivee = mystring2UP.toLowerCase();
  
        console.log('arrivée : '+this.trajet.tra_lieuArrivee);
  }

}



