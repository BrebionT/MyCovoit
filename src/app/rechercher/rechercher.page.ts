import { Component, OnInit  } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';

import { AngularFireDatabase } from '@angular/fire/database';

import {AngularFirestore} from '@angular/fire/firestore';

import { AngularFireAuth } from '@angular/fire/auth';

import { Router } from '@angular/router';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-rechercher',
  templateUrl: 'rechercher.page.html',
  styleUrls: ['rechercher.page.scss']
})



export class RechercherPage {
  public userid;
  today = new Date();
  utilisateurs: Observable<any[]>;
  trajets: Observable<any[]>;
  uti_tra: Observable<any[]>;
  public trajet_a_venir : [] = [];
  public trajet_a_venir2 : []= [];
  liste_dates = [];

  public trajetprevus :boolean = false;

  public trajettrouve : boolean = false;

  trajet: Observable<any[]>;
  Tra_lieuDepart: string;
  Tra_lieuArrivee: string;
  Tra_dateDepart: string;
  Tra_heureDepart: string;
  //tra_nbPassager: string;

dataUser = {
  email: '',
  password: ''
};

connected: boolean;


  constructor(
    private router: Router,
    public toastController: ToastController,
    public afAuth: AngularFireAuth,
    public afDB: AngularFireDatabase,
    public firestore: AngularFirestore
  ) {
    
    this.trajet = firestore.collection('trajets').valueChanges();

    /*this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        console.log('non connecté');
        this.connected = false;
      } else {
        console.log('connecté: ' + auth.uid);
        this.connected = true;
      }
    });*/

}


/*addFirestore() {
  this.firestore.collection('Trajets').add({
      TraLieuDepart: this.tra_lieuDepart,
      TraLieuArriver: this.tra_lieuArrivee,
      dateDeb: this.tra_dateDepart,
      TraHeureDepart: this.tra_heureDepart,
      //TraNbPassager: this.tra_nbPassager,

    });
}*/
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
this.trajet.subscribe(tra =>{
tra.forEach(traj=> {
  console.log("ok")
  //console.log("départ "+traj['tra_lieuDepart']+" arrivé "+traj['tra_lieuArrivee'])
// console.log(' lieu de départ : ',valeur1['tra_lieuDepart'] , this.Tra_lieuDepart)
// console.log(' lieu d\'arrivee : ',valeur1['tra_lieuArrivee'] , this.Tra_lieuArrivee)
// console.log(' date de départ : ',valeur1['tra_dateDepart'] , this.Tra_dateDepart.slice(0,-19))

//this.errorValue("départ "+traj['tra_lieuDepart']+" arrivé "+traj['tra_lieuArrivee'])
if(traj['tra_lieuDepart'] == this.Tra_lieuDepart 
&& traj['tra_lieuArrivee'] == this.Tra_lieuArrivee )
{
  this.trajettrouve = true;
  console.log(this.trajettrouve)
  console.log(traj['tra_lieuDepart'],'/////',this.Tra_lieuDepart)
  console.log(traj['tra_lieuArrivee'],'/////',this.Tra_lieuArrivee)
}
console.log(this.trajettrouve)
    })
  })
}

redirectiontrajettrouve(){
  console.log(this.trajettrouve)
  if(this.trajettrouve == true){
    this.router.navigateByUrl('tabs/recherchetrajet')
  }
  else{
    this.errorValue("Aucun trajet trouvé !")
  }
}

fonctionstrouvertrajets(){
  this.recherche();
  this.redirectiontrajettrouve();
}







getTrajet(){
  var that = this;
  this.trajet_a_venir = [];
  this.liste_dates = [];


  this.uti_tra.subscribe(uti =>{
    uti.forEach(value2=> {
      if(value2['uti_tra_idUti']==that.userid){
        this.trajets.subscribe(tra =>{
          tra.forEach(value3=> {
            if(value3['tra_id']==value2['uti_tra_idTra']){
              var date = new Date (value3['tra_dateDepart']);
              var newDate = date ;
              if(newDate>=this.today){
                that.trajetprevus=true;
               // this.trajet_a_venir.push([value2, value3]);
                this.liste_dates.push({date:newDate, trajet:value3, role:value2['uti_tra_role']});
                this.liste_dates.sort(function(a,b){
                  return a.date - b.date;
                });
                //console.log(this.liste_dates)
              }
            }
          })
        })
      }
    })
  })
 
  
}
}




 
 
  




