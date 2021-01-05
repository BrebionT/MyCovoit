import { Component } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.page.html',
  styleUrls: ['./inscription.page.scss'],
})
export class InscriptionPage  {

  trajets: Observable<any[]>;
  conducteur: string;
  heureArrive: string;
  heureDepart: string;
  passager: string;
  villeArrive: string;
  villedepart: string;

  user: Observable<any[]>;
  
  constructor(
    public afDB: AngularFireDatabase,
    public firestore: AngularFirestore
  ) {
    this.user = this.firestore.collection('user').valueChanges();
    this.trajets = this.firestore.collection('Trajets').valueChanges();
  }
  
}
