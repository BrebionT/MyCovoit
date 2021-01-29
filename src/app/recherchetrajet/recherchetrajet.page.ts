import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';


@Component({
  selector: 'app-recherchetrajet',
  templateUrl: './recherchetrajet.page.html',
  styleUrls: ['./recherchetrajet.page.scss']
})
export class RecherchetrajetPage implements OnInit{

  
  today = new Date();
  public trajet:any;
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
  
  


  ngOnDestroy(){
    console.log("detruit");
    this.liste_dates=[];
    this.trajet_a_venir = [];
    this.trajetprevus=false;
  }
  

  returnConnected(){
    return this.connected;
  } 
     
  
  
  ngOnInit(){
    
  } 
  

  
  getTrajet(){
    var that = this;
    this.trajet_a_venir = [];
    this.liste_dates = [];
  

    this.trajets.subscribe(traj =>{
      traj.forEach(value2=> {
                var date = new Date (value2['tra_dateDepart']);
                var newDate = date ;
                //console.log(this.today ,'///',newDate)
                if(newDate>=this.today){
                 // this.trajet_a_venir.push([value2, value3]);
                  this.liste_dates.push({date:newDate, trajet:value2});
                  this.liste_dates.sort(function(a,b){
                    return a.date - b.date;
                  });
                  //console.log(this.liste_dates)
                }
              })
          })
      }
  
  }