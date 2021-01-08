import { Component } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-tableaubord',
  templateUrl: './tableaubord.page.html',
  styleUrls: ['./tableaubord.page.scss']
})
export class TableaubordPage {
  utilisateurs: Observable<any[]>;
  trajets: Observable<any[]>;
  public userid;

  constructor(
    private router: Router,
    public firestore: AngularFirestore,
    public afAuth: AngularFireAuth
    ) 
  {
    this.connecter();
    this.utilisateurs = this.firestore.collection('utilisateurs').valueChanges();
    this.trajets = this.firestore.collection('trajets').valueChanges();
  }

  goProfil(){
    var route = this.router;
    route.navigateByUrl('/tabs/profil');
  }
  connecter(){
    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        this.userid = auth.uid;
        console.log(this.userid);
      }
    });
  }
  
     
  /*trajetprevu(trajets){
      if (Date >= trajets.getDate()) {
          
      }
    

  }*/
  
}