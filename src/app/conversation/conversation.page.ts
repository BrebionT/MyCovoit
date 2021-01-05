import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';



@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
})
export class ConversationPage implements OnInit{
  dataUser = {
    email:'',
    password:''
  };
  connected= true;
  userId= 'strIr5fvyveXmXu4F6XoSbbPXCxJjR2ing';
  userDestId= 'WekKZzp3LeUpgfY04ut0pKUY0Io2';
  messageText: any;
  public messages: any = [];

  constructor(
    
    public afAuth: AngularFireAuth,
    public afDB: AngularFireDatabase
  ) {

    /* this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        console.log('non connecté');
        this.connected = false;
      } else {
        console.log('connecté: ' + auth.uid);
        this.userId = auth.uid;
        this.connected = true;
        this.getMessages();
      }
    }); */
    this.getMessages(this.userId,this.userDestId);
  }
  ngOnInit() {
  }
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

    login() {
      this.afAuth.signInWithEmailAndPassword(this.dataUser.email, this.dataUser.password);
       this.dataUser = {
         email: '',
         password: ''
       };
    }
 
    
  }



  

  

