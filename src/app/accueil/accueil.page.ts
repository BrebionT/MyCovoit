import { Component } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-accueil',
  templateUrl: 'accueil.page.html',
  styleUrls: ['accueil.page.scss']
})
export class AccueilPage {
  users: Observable<any[]>;
  trajets: Observable<any[]>;

  constructor(public firestore: AngularFirestore) {
    this.users = this.firestore.collection('Users').valueChanges();
    this.trajets = this.firestore.collection('Trajets').valueChanges();
  }

}
 