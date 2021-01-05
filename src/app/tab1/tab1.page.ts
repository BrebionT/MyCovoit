import { Component } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

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
