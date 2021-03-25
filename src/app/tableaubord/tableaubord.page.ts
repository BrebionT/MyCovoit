import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';


@Component({
  selector: 'app-tableaubord',
  templateUrl: './tableaubord.page.html',
  styleUrls: ['./tableaubord.page.scss']
})
export class TableaubordPage implements OnInit{

  today = new Date();
  public myDate:any;
  public trajet:any;

  utilisateurs: Observable<any[]>;
  image;
  trajets: Observable<any[]>;
  uti_tra: Observable<any[]>;

  utilisateur: {prenom:String,nom:String,sexe:String,ville:String,cp:String,mail:String,tel:String,bio:String,photo:String,parle:boolean,musique:boolean,cigarette:boolean,animal:boolean};


  public trajet_a_venir : [] = [];
  public trajet_a_venir2 : []= [];
  liste_dates = [];
  liste_dates_id = [];
  
  public connected: boolean = false;

  public userid;
  public trajetprevus :boolean = false;

  constructor(
    
    private router: Router,
    public firestore: AngularFirestore,
    public afAuth: AngularFireAuth,
    public afDB: AngularFireDatabase,
    public afSG: AngularFireStorage
    ) 
  {
    
    
  }

  ionViewWillEnter(){
    //console.log("enter")
    //this.utilisateurs = this.firestore.collection('utilisateurs').valueChanges();
    //('entrer tableaubord')
    this.liste_dates = [];
    this.trajet_a_venir = [];
    this.utilisateurs=null;
    this.trajets=null;
    this.uti_tra=null;

    this.trajets = this.firestore.collection('trajets').valueChanges();
    this.uti_tra = this.firestore.collection('utilisateur_trajet').valueChanges();

    this.getAuth();
    
    this.liste_dates = [];
    this.trajet_a_venir = [];
    this.liste_dates_id = [];
    this.getTrajet();
    
  }

  ionViewWillLeave(){
    //("quitter tableaubord")
    this.liste_dates = [];
    this.trajet_a_venir = [];
    this.utilisateurs=null;
    this.trajets=null;
    this.uti_tra=null;
    this.liste_dates_id = [];

  }


  getAuth(){
    this.trajet_a_venir = [];
    this.liste_dates = [];
    this.liste_dates_id = [];
    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        this.connected=false;
        this.router.navigateByUrl('/connexion');
      } else {
        this.connected=true;
        this.userid = auth.uid;
        this.getUtilisateur(this.userid);
      }
    });
  }
  
  
  getUtilisateur(userid){

    function getImagesStorage(that,image: any,id) {
      var images;
      //console.log("getImagesStorage")
      that.afSG.ref('users/'+image).getDownloadURL().subscribe(imgUrl => {
        images= imgUrl;
        that.image = images;
      });
      return images;
    }

    var that = this;

    var user;
    user = that.firestore.collection("utilisateurs").doc(userid);
    user.ref.get()
    .then((doc2)=>{
      if(doc2.data()!=undefined){
        that.utilisateur = doc2.data()
        getImagesStorage(that,doc2.data()['photo'],doc2.data()['id'])
      }
    })

    /* this.utilisateurs.subscribe(uti =>{
      uti.forEach(value => {
        if(value['id']==userid){
          that.utilisateur = value;
          //console.log('photo : ',value['photo'])
          getImagesStorage(that,value['photo'],value['id'])
        }
      })
    }); */
    
  }

  ngOnDestroy(){
    //console.log("detruit");
    this.liste_dates=[];
    this.liste_dates_id = [];
    this.trajet_a_venir = [];
    this.trajetprevus=false;
  }


  getTrajet(){
    var that = this;
    
    this.trajet_a_venir = [];
    this.liste_dates = [];
    this.liste_dates_id = [];
  
    if(this.uti_tra != null){
      this.uti_tra.subscribe(uti =>{
        that.trajetprevus=false;
        
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
                      //console.log(this.liste_dates_id)
                      var inclus = this.liste_dates_id.includes(value3['tra_id'])
                      //console.log(inclus)
                      if(inclus==false){
                        this.liste_dates_id.push(value3['tra_id']);
                        this.liste_dates.push({date:newDate, trajet:value3, role:value2['uti_tra_role']});
                        this.liste_dates.sort(function(a,b){
                          return a.date - b.date;
                        });
                      }
                      
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

  goDetail(id){
    var route = this.router;
    route.navigateByUrl('/tabs/trajet-detail#'+id);
  }
  
  
  ngOnInit(){
  } 
  

  returnConnected(){
    return this.connected;
  } 
     
      
}   