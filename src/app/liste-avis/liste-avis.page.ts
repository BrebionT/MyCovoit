import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-liste-avis',
  templateUrl: './liste-avis.page.html',
  styleUrls: ['./liste-avis.page.scss'],
})
export class ListeAvisPage implements OnInit {

  avis: Observable<any[]>;
  utilisateurs : Observable<any[]>;
  utilisateur=[];

  public listeAvis=[]

  public userid;
  public userAvis;
  public userId:any;


  constructor(public firestore: AngularFirestore,
    public afAuth: AngularFireAuth,
    private router: Router,
    ) { 
    this.connecter();
    
    
    
  }

  connecter(){
    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        this.userid = auth.uid;
        this.utilisateur=[];
      }
    });
  }

  ngOnInit() {
    this.avis = this.firestore.collection('avis').valueChanges();
    this.utilisateurs = this.firestore.collection('utilisateurs').valueChanges();

    this.userAvis =this.router.url.slice(-28);
    this.getUtilisateur()
  }

  ngOnDestroy(){
    this.utilisateur=[];
    this.utilisateurs=null;
    this.avis=null;
  }

  ionViewWillLeave(){
    this.utilisateur=[];
    this.utilisateurs=null;
    this.avis=null;
  }

  getUtilisateur(){
    this.utilisateur=[];
    var that = this;
    if(this.utilisateurs!=null){
      this.utilisateurs.subscribe(uti =>{
        uti.forEach(value => {
          if(value['id']==that.userAvis){
            that.utilisateur=[value];
            this.getAvis();
          }
        })
      });
    }
    
    
  }
    
  getAvis(){
    if(this.avis!=null){
      this.avis.subscribe(avis =>{
        avis.forEach( unAvis =>{
          if(this.utilisateurs != null){
            this.utilisateurs.subscribe(utilisateurs =>{
              utilisateurs.forEach( utilisateur =>{
                if(unAvis['destinataire']==this.userid){
                  if(unAvis['utilisateur']== utilisateur['id']){
                    this.listeAvis.push({avis:unAvis,user:utilisateur})
                  }
                }
              })
            })
          }
          
        })
      })
      console.log(this.listeAvis)
    }
    
  }

}
