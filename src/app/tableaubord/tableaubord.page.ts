import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';


@Component({
  selector: 'app-tableaubord',
  templateUrl: './tableaubord.page.html',
  styleUrls: ['./tableaubord.page.scss']
})
export class TableaubordPage implements OnInit{

  today = new Date();

  utilisateurs: Observable<any[]>;
  trajets: Observable<any[]>;
  uti_tra: Observable<any[]>;

  utilisateur: Observable<any[]>;


  public trajet_a_venir : [] = [];
  public trajet_a_venir2 : []= [];
  liste_dates = [];
  
  public connected: boolean = false;

  public userid;
  public trajetprevus :boolean = false;

  constructor(
    
    private router: Router,
    public firestore: AngularFirestore,
    public afAuth: AngularFireAuth,
    public afDB: AngularFireDatabase
    ) 
  {
    
    
  }

  ionViewWillEnter(){
    console.log("enter")
    this.utilisateurs = this.firestore.collection('utilisateurs').valueChanges();
    this.trajets = this.firestore.collection('trajets').valueChanges();
    this.uti_tra = this.firestore.collection('utilisateur_trajet').valueChanges();

    this.getAuth();
    this.getUtilisateur();
    this.liste_dates = [];
    this.trajet_a_venir = [];
    this.getTrajet();
  }

  ionViewWillLeave(){
    console.log("quitter")
    this.liste_dates = [];
    this.trajet_a_venir = [];
    this.utilisateurs=null;
    this.trajets=null;
    this.uti_tra=null;

  }


  getAuth(){
    this.trajet_a_venir = [];
    this.liste_dates = [];
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
    this.trajet_a_venir = [];
    this.trajetprevus=false;
  }


  getTrajet(){
    var that = this;
    this.trajet_a_venir = [];
    this.liste_dates = [];
  
    if(this.uti_tra != null){
      this.uti_tra.subscribe(uti =>{
        uti.forEach(value2=> {
          if(value2['uti_tra_idUti']==that.userid){
            if(this.trajets != null){
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
          }
      })
    })
  }
    
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
     
      
}   