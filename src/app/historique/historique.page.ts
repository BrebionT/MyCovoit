import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';

import { AngularFireDatabase } from '@angular/fire/database';

import {AngularFirestore} from '@angular/fire/firestore';

import { AngularFireAuth } from '@angular/fire/auth';

import {Observable} from 'rxjs';
import { Router } from '@angular/router';




@Component({
  selector: 'app-historique',
  templateUrl: 'historique.page.html',
  styleUrls: ['historique.page.scss']
})
export class HistoriquePage implements OnInit{

  today = new Date();

  utilisateurs: Observable<any[]>;
  trajets: Observable<any[]>;
  trajets2: Observable<any[]>;
  uti_tra: Observable<any[]>;
  uti_tra2: Observable<any[]>;

  utilisateur: Observable<any[]>;

  liste_dates = [];
  liste_users = [];
  
  public connected: boolean = false;

  public userid;
  public trajetfait :boolean = false;
  
  constructor(
    private router: Router,
    public toastController: ToastController,
    public afAuth: AngularFireAuth,
    public afDB: AngularFireDatabase,
    public firestore: AngularFirestore,
    public alertController: AlertController
  ) {
    
    
  }

  ionViewWillEnter(){
    console.log("enter")
    this.utilisateurs = this.firestore.collection('utilisateurs').valueChanges();
    this.trajets = this.firestore.collection('trajets').valueChanges();
    this.trajets2 = this.firestore.collection('trajets').valueChanges();
    this.uti_tra = this.firestore.collection('utilisateur_trajet').valueChanges();
    this.uti_tra2 = this.firestore.collection('utilisateur_trajet').valueChanges();

    this.getAuth();
    this.getUtilisateur();
    this.liste_dates = [];
    this.liste_users = [];
    this.getTrajet();
  }

  ionViewWillLeave(){
    console.log("quitter")
    this.liste_dates = [];
    this.liste_users = [];
    this.utilisateurs=null;
    this.trajets=null;
    this.uti_tra=null;
    this.trajets2=null;
    this.uti_tra2=null;
  }


  getAuth(){
    this.liste_dates = [];
    this.liste_users = [];
    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        this.connected=false;
        this.router.navigateByUrl('/connexion');
      } else {
        this.connected=true;
        this.userid = auth.uid;
      }
    });
  }
  
  
  getUtilisateur(){
    var that = this;
    this.utilisateurs.subscribe(uti =>{
      uti.forEach(value => {
        if(value['tra_id']==that.userid){
          that.utilisateur = value;
        }
      })
    });
    
  }

  ngOnDestroy(){
    console.log("detruit");
    this.liste_dates=[];
    this.liste_users = [];
    this.trajetfait=false;
    this.utilisateurs=null;
    this.trajets=null;
    this.uti_tra=null;
    this.trajets2=null;
    this.uti_tra2=null;
  }


  getTrajet(){
    var that = this;
    this.liste_dates = [];
    this.liste_users = [];
  

    this.uti_tra.subscribe(uti =>{
      uti.forEach(value2=> {
        if(value2['uti_tra_idUti']==that.userid){
          this.trajets.subscribe(tra =>{
            tra.forEach(value3=> {
              if(value3['tra_id']==value2['uti_tra_idTra']){
                var date = new Date (value3['tra_dateDepart']);
                var newDate = date ;
                if(newDate<this.today){
                  that.trajetfait=true;
                  this.liste_dates.push({date:newDate, trajet:value3, role:value2['uti_tra_role']});
                  this.liste_dates.sort(function(a,b){
                    return b.date - a.date;
                  });

                  that.uti_tra2.subscribe(uti_tras2 =>{
                    uti_tras2.forEach(uti_tra2=> {
                      
                      if(value3['tra_id']==uti_tra2['uti_tra_idTra']){
                        if(uti_tra2['uti_tra_idUti'] != this.userid){
                          console.log(uti_tra2)
                          this.liste_users.push({trajet:value3, user:uti_tra2['uti_tra_idUti'], role:uti_tra2['uti_tra_role']});
                        }
                      }
                    })
                  })
                }
              }
            })
          })
        }
      })
    })
   
    
  }


  goProfil(){
    var route = this.router;
    route.navigateByUrl('/tabs/profil');
  }
  
  
  ngOnInit(){
  } 
  

  returnConnected(){
    return this.connected;
  }

  async showTrajet(trajet){
    

    async function showAlert(that,options){
      var alert = await that.alertController.create(options);
      alert.present();
    }
    var liste_user_trajet = [];
    if(this.liste_users.length>0){
      for(var i=0;i<this.liste_users.length;i++){
        if(trajet.trajet.tra_id==this.liste_users[i].trajet.tra_id){
          liste_user_trajet.push({user:this.liste_users[i].user, role:this.liste_users[i].role})
        }
      }
  
      var options = {
        header: 'Notez un utilisateur',
        message: 'Sélectionner l\'utilisateur que vous souhaitez laisser votre avis.',
        inputs:[],
        buttons: [
          {
            text: 'Quitter',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Ok',
            handler: data => {
              //console.log(data);
              if(data!=undefined){
                const path = '/noter#'+data;
                this.router.navigateByUrl(path);
              }
              
            }
          }
        ],
        
      };
  
      
  
      if(liste_user_trajet.length>0){
        for(var i=0; i< liste_user_trajet.length; i++) {
          let role = "";
          console.log('role dans liste : ',liste_user_trajet[i].role)
          if(liste_user_trajet[i].role){
            role=liste_user_trajet[i].role;
            console.log('role : ',role)
          
          var test = this.firestore.collection("utilisateurs",ref =>ref.where("id", "==", liste_user_trajet[i].user)).valueChanges()
          test.subscribe(utis =>{
            utis.forEach(uti=> {
              console.log('option')
              options['inputs'].push({ name : 'options', value: uti['id'], label: uti['prenom'] + " " + uti['nom']+" ( "+role+" )", type: 'radio' })
            })
          })
        }
        }
        var that = this;
        setTimeout(function(){
          showAlert(that,options);
        },100)
        
      }
    }
  }
}