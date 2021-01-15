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

@Component({
  selector: 'app-proposer',
  templateUrl: './proposer.page.html',
  styleUrls: ['./proposer.page.scss'],
})
export class ProposerPage implements OnInit{
  trajet = {} as trajets;
  messages: Observable<any[]>;
  users: Observable<any[]>;

  public proposerView : Observable<any[]>;
  public userList = Array();
  public userList2 = Array();

  public connected= false;
  public userId;
  public destId;
  
  constructor(
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
  async createTrajets(trajet: trajets) {
    // console.log(post);

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
      this.navCtrl.navigateRoot('tabs/tableauBord');
    }
  }

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
}


