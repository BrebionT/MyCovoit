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
  etape = {eta_ville:""} as etapes;
  messages: Observable<any[]>;
  users: Observable<any[]>;
  today = new Date();

  beforeClick :boolean = true;
  data: boolean = false;

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

  showvilleEtape=[false];
  disabledEtape = [{value:false}];

  Tra_lieuDepartBIS="";
  Tra_lieuArriveeBIS="";
  listeEtapeBIS=[];

  liste_depart;
  liste_arrivee;
  liste_etape= [];
  
  public anArray:any=[];
  public list = [{value:'listeEtape'}];;
 
  public listeEtape = [{value:''}];

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
    this.liste_etape=[{nom:''}]


    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        this.router.navigateByUrl('/connexion');
        this.connected = false;
      } else {
        this.userId = auth.uid;
        this.connected = true;
        this.users = this.firestore.collection("utilisateurs").valueChanges();
        this.users = this.firestore.collection("etapes").valueChanges();
        this.id = new Date().toISOString();
        
      }});
      
    
  }
  ngOnInit() {}
  
  async createTrajets(utilisateurTrajet: utilisateur_trajet,trajet: trajets) {
    //console.log("5.1")
    // //console.log(post);
    trajet.tra_id = this.id;
    this.firestore.collection('trajets').add(trajet);  
    this.navCtrl.navigateRoot('tabs/tableaubord');
  }

heure(utilisateurTrajet: utilisateur_trajet,trajet: trajets){
  //console.log("2")  
      if(this.trajet.tra_heureDepart > this.trajet.tra_heureArrivee ){
        this.showToast("L'heure d'arrivée ne peut pas être inférieur à celle de départ !");
      }
      else{
        this.date(utilisateurTrajet,trajet);
      }
}

  date(utilisateurTrajet: utilisateur_trajet,trajet: trajets){
    //console.log("3")
    var date1 = this.trajet.tra_dateDepart;
    var date = new Date (date1);
    var newDate = date ;
    var heure = newDate.getHours();
    if( newDate > this.today){
      //console.log(newDate.getDay()+ '//' +this.today.getDay() +'//'+newDate.getMonth() +"//"+ this.today.getMonth() +"//"+ newDate.getFullYear() +"//"+ this.today.getFullYear())
      this.presentAlertConfirm(utilisateurTrajet,trajet);
    }
    else{
     // //console.log(newDate +"///"+ this.today)
      this.showToast("Merci de rentrer une date ultérieur à celle d'aujourd'hui !");
  }}

  async createUtilisateur_trajet(utilisateurTrajet: utilisateur_trajet,trajet: trajets) {
    //console.log("5.2")
    // //console.log(post);
    utilisateurTrajet.uti_tra_idUti = this.userId;
    utilisateurTrajet.uti_tra_idTra = this.id;
    utilisateurTrajet.uti_tra_role = "Conducteur";
    this.firestore.collection('utilisateur_trajet').add(utilisateurTrajet);
    this.navCtrl.navigateRoot('tabs/tableaubord');
    }

  formValidation(utilisateurTrajet: utilisateur_trajet,trajet: trajets) {
    //console.log("1")
    if (!this.trajet.tra_lieuDepart) {
      // show toast message
      this.showToast('Entrez un lieu de départ');
      return false;
    }
    if (!this.trajet.tra_lieuArrivee) {
      // show toast message
      this.showToast('Entrez un lieu de d\'arrivée');
      return false;
    }
    if (!this.trajet.tra_heureDepart) {
      // show toast message
      this.showToast('Entrez une heure de depart');
      return false;
    }
    if (!this.trajet.tra_heureArrivee) {
      // show toast message
      this.showToast('Entrez une heure de d\'arrivée');
      return false;
    }
    if (!this.trajet.tra_dateDepart) {
      // show toast message
      this.showToast('Entrez une date de départ');
      return false;
    }
    if (!this.trajet.tra_dateDepart) {
      // show toast message
      this.showToast('Entrez une date de départ');
      return false;
    }
    if (!this.trajet.tra_nbPlaces) {
      // show toast message
      this.showToast('Veuillez entrer le nombre de places disponibles');
      return false;
    }
    this.heure(utilisateurTrajet, trajet)
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
    //console.log("4")   
    this.createUtilisateur_trajet(utilisateurTrajet, trajet);
    this.createTrajets(utilisateurTrajet, trajet);
    this.listeEtapeBIS.forEach(element => {
      if(element.value != ""){
      this.createEtape(element.value)}})
  }
  
  async presentAlertConfirm(utilisateurTrajet: utilisateur_trajet,trajet: trajets) {
    
    var tra_lieuDepart = this.trajet.tra_lieuDepart
    if(tra_lieuDepart == undefined){
      tra_lieuDepart = ""
    }
    var tra_dateDepart
    if(tra_dateDepart == undefined){
      tra_dateDepart = ""
    }
    var tra_heureDepart
    if(tra_heureDepart == undefined){
      tra_heureDepart = ""
    }
    var tra_lieuArrivee
    if(tra_lieuArrivee == undefined){
      tra_lieuArrivee = ""
    }
    var tra_heureArrivee
    if(tra_heureArrivee == undefined){
      tra_heureArrivee = ""
    }
    var tra_nbPlaces
    if(tra_nbPlaces == undefined){
      tra_nbPlaces = ""
    }
    var tra_etape
    if(tra_etape == undefined){
      tra_etape = ""
    }
    const alert = await this.alertController.create({
      header: 'Confirmation de trajet !',
      message: `<p><strong>LIEU DE DEPART : </strong>`+tra_lieuDepart+`</p>`+
      `<p><strong>DATE DE DEPART : </strong>`+this.trajet.tra_heureDepart+`</p>`+
      `<p><strong>LIEU D'ARRIVEE : </strong>`+this.trajet.tra_lieuArrivee+`</p>`+
      `<p><strong>HEURE DE DEPART : </strong>`+this.trajet.tra_heureDepart+`</p>`+
      `<p><strong>HEURE D'ARRIVEE : </strong>`+this.trajet.tra_heureArrivee+`</p>`+
      `<p><strong>NOMBRE DE PLACE(S) : </strong>`+this.trajet.tra_nbPlaces+`</p>`,
     // `<p><strong>LES ETAPES : </strong>`+this.trajet.tra_etape+`</p>`,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            //console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Confirmer',
          handler: () => {
            this.LancerFonction(utilisateurTrajet,trajet);
            //console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

addEtape(){
  this.beforeClick = false;
  //this.createEtape()
}

/*parcour(utilisateurTrajet: utilisateur_trajet,trajet: trajets){
  this.listeEtapeBIS.forEach(element => {
    if(element.value != ""){
    this.createEtape(element.value)
    this.LancerFonction(utilisateurTrajet,trajet);
}
this.LancerFonction(utilisateurTrajet,trajet);
})
}*/

async createEtape(idx) { 
  if (this.etape.eta_ville != "") {
   // this.list.forEach(element => {
      this.firestore.collection('etapes').add({
        eta_id: new Date().toISOString()+Math.floor(Math.random() * 99),
        eta_idTra: this.id,
        eta_ville: idx,
      });
  //  });
    // //console.log("ready to submit");
   
  }}


goTo(){
    //console.log('this.anArray',this.anArray);
    this.data=true;
   }
Add(){
    this.listeEtape.push({'value':''});
    this.anArray.push({'value':''});
    this.listeEtapeBIS.push({'value':''});
    this.disabledEtape.push({value:false})
    this.liste_etape.push({nom:''})
    this.showvilleEtape.push(false)
   }
Remove(){
    this.listeEtape.pop();
    this.anArray.pop();

    this.listeEtapeBIS.pop();
    this.disabledEtape.pop();
    this.liste_etape.pop();
    this.showvilleEtape.pop()
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

getVilleEtape(event,idx){
  if(this.listeEtapeBIS[idx].value.trim()==""){
    this.listeEtapeBIS[idx].value="";
  }
  const apiUrl2 = 'https://geo.api.gouv.fr/communes?nom='
  const format = '&format=json';
  
  let listeEtapeBIS = event;
  //let ville = this.user.ville;
  let url2 = apiUrl2+listeEtapeBIS+'&limit=3'+format;


    fetch(url2, {method: 'get'}).then(response => response.json()).then(results => {
      this.liste_etape[idx]=results
      //console.log(results);
      
      
    }).catch(err => {
      this.liste_etape[idx]=[{nom:''}]
      //console.log(err);
    });
}

addVilleEtape(val,idx){
this.etape.eta_ville=val.nom;
this.listeEtapeBIS[idx].value = val.nom;

this.showvilleEtape[idx]=false;

this.disabledEtape[idx].value = true;
//this.disabledEtape=true;
}

showVilleEtape(val,idx){
  //console.log(this.listeEtapeBIS)
if(this.disabledEtape[idx].value==false){
  this.showvilleEtape[idx]=val;
}

}

suppVilleEtape(idx){
this.etape.eta_ville="";
this.listeEtapeBIS[idx].value = "";
this.disabledEtape[idx].value=false;
this.disabledDepart=false;
}

isDisabledEtape(idx){
//console.log(this.trajet.tra_lieuDepart);
if(this.etape.eta_ville!=""){
  this.disabledEtape[idx].value=true;
  return true;
}else{
  this.disabledEtape[idx].value=false;
  return false;
}
}

}



