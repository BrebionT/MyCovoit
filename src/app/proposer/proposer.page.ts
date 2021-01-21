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

  

  async createUtilisateur_trajet(utilisateurTrajet: utilisateur_trajet,id) {
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
    this.createUtilisateur_trajet(utilisateurTrajet, id);
    this.createTrajets(trajet, id);
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

}



