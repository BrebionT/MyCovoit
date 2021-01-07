import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  messages: Observable<any[]>;
  users: Observable<any[]>;

  public userId = '4hpdIrlr6NPobPmgPy1Bayf7Qkw1';
  public length = 0;

  constructor(
    public firestore: AngularFirestore,
    public afDB: AngularFireDatabase,
    private router: Router
  ) {

    this.messages = this.firestore.collection("messages").valueChanges();
    this.users = this.firestore.collection("utilisateurs").valueChanges();
    
  }

  ngOnInit() {
  }

  convers(){
    this.router.navigateByUrl('/tabs/conversation');
  }



}
