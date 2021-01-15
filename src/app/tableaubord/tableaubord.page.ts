import { Component, OnInit } from '@angular/core';
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
  public trajet= Array();
  public uti_tras=Array();
  
  public connected: boolean = false;

  public util;
  public userid;
  public trajetprevus :boolean;

  constructor(
    
    private router: Router,
    public firestore: AngularFirestore,
    public afAuth: AngularFireAuth,
    public afDB: AngularFireDatabase
    ) 
  {
    this.utilisateurs = this.firestore.collection('utilisateurs').valueChanges();
    this.trajets = this.firestore.collection('trajets').valueChanges();
    this.uti_tra = this.firestore.collection('utilisateur_trajet').valueChanges();

    this.getAuth();
    this.getUtilisateur();
    this.getUtiTrajetByUti();

    /*var utiTrajetRef = firestore.collection('this.uti_tra');
    var query = //this.firestore.collection('utiTrajetRef', ref => ref.where('uti_tra_idUti', '==', this.userid))
                utiTrajetRef.where("uti_tra_idUti", "==", "userid")
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });*/
  }




  getAuth(){
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
        if(value['id']==that.userid){
          that.utilisateur = value;
        }
      })
    });
    
  }
  
  getUtiTrajetByUti(){
    var that = this;
    this.uti_tra.subscribe(uti =>{
      uti.forEach(value2=> {
        if(value2['uti_tra_idUti']==that.userid){
          that.uti_tras.push(value2);
          this.getTrajet(value2['uti_tra_idTra']);
        }
      })    
    });
  }
  
  getTrajet(idUtiTra){
    var that = this;
    this.trajets.subscribe(tra =>{
      tra.forEach(value3 => {
        if(value3['id']==idUtiTra){
          that.trajet.push(value3);
        }
      })    
    });
  }
   


  goProfil(){
    var route = this.router;
    route.navigateByUrl('/tabs/profil');
  }

     
  trajetprevus2(){
    //console.log(this.today)
    var that = this;
    this.trajets.subscribe(date =>{
    date.forEach(value =>{
    //console.log(value['tra_dateDepart'] +" "+ this.today);
    var newDate = new Date (value['tra_dateDepart']);
    if( newDate > this.today){
      console.log(value['tra_dateDepart'] +"   ////   "+ this.today);
      console.log("plus grand");
    that.trajetprevus=true;
    }else{
    that.trajetprevus=false;
    console.log(value['tra_dateDepart'] +"   ////   "+ this.today);
    console.log("plus petit");
    }})
  })
  }
  
  
  ngOnInit(){
   // this.trajetprevus2();
  } 
  

returnConnected(){
  return this.connected;
}
     /* if (Date > trajets.tra_dateDepart()) {
        console.log("trajet");
      }
      else{
        console.log("pas trajets")
      }
      }*/
     
     
      
    }   