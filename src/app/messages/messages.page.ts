import { Component, OnInit } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  constructor(
    public afDB: AngularFireDatabase,
    private router: Router
  ) {}

  ngOnInit() {
  }

  convers(){
    this.router.navigateByUrl('/tabs/conversation');
  }

  /* add() {
    this.afDB.list('Utilisateur/').push({
      userAuthId: 'WekKZzp3LeUpgfY04ut0pKUY0Io2',
      nom: 'Brebion',
      prenom: 'Thibault',
      photo:'../../assets/profil.png'
    });
  } */

}
