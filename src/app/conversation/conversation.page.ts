import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import {AngularFirestore} from '@angular/fire/firestore';
import { Router } from '@angular/router';


@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
})
export class ConversationPage implements OnInit{
  
  connected= true;
  public userId;

  messageText: any;
  public messages: any = [];

  constructor(
    
    public afAuth: AngularFireAuth,
    public afDB: AngularFireDatabase,
    public firestore: AngularFirestore,
    private router: Router,
  ) {

    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        this.router.navigateByUrl('/tabs/tab2');
        this.connected = false;
      } else {
        this.userId = auth.uid;
        this.connected = true;
        //this.getMessages();
      }
    });
    //this.getMessages(this.userId,this.userDestId);
  }
  ngOnInit() {
  }
  
  /*
  envoyerMessage(){
	  this.afDB.list('Messages/').push({
      userId: this.userId,
      userDestId: this.userDestId,
      text: this.messageText,
      date: new Date().toISOString()
    });
	this.messageText = '';
  }
  getMessages(userId,userDestId) {
    this.afDB.list('Messages/', ref => ref.orderByChild('date')).snapshotChanges(['child_added'])
    .subscribe(actions => {
      this.messages = [];
      actions.forEach(action => {
        if((userId==action.payload.exportVal().userId && userDestId==action.payload.exportVal().userDestId)||(userId==action.payload.exportVal().userDestId && userDestId==action.payload.exportVal().userId)){
          this.messages.push({
            userId: action.payload.exportVal().userId,
            userDestId: action.payload.exportVal().userDestId,
            text: action.payload.exportVal().text,
            date: action.payload.exportVal().date
          });
        }
      })
    });
  }
 */
    
}



  

  
