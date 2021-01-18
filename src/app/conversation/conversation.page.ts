import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import {AngularFirestore} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
})
export class ConversationPage implements OnInit{
  
  connected= true;
  public userId;
  public destId;

  messageText: any;
  
  public messagesView = Array();
  public destView = {
    nom: '',
    prenom: ''
  };


  public messages: Observable<any[]>;
  public utilisateurs : Observable<any[]>;
  public messagesTest;
  

  constructor(
    
    public afAuth: AngularFireAuth,
    public afDB: AngularFireDatabase,
    public firestore: AngularFirestore,
    private router: Router,
  ) {
    

    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        this.router.navigateByUrl('/connexion');
        this.connected = false;
      } else {
        this.userId = auth.uid;
        this.connected = true;
        this.destId = this.router.url.slice(-28);

        this.messages = this.firestore.collection('messages').valueChanges();
        this.utilisateurs = this.firestore.collection('utilisateurs').valueChanges();
        this.getDest(this.destId);
        this.getMessages(this.userId,this.destId);
        this.scrollToBottom();
      }
    });
  }

  
  ngOnInit() {
    var that = this;
    const db = this.firestore;
    that.messagesView = [];
    db.collection("messages").get().toPromise().then((snapshot)=>{
      snapshot.docs.forEach(doc =>{
        //console.log(doc.id, doc.data()['utilisateur']) //     doc.data()['utilisateur']

        var value = doc.data();

        if((value['utilisateur']==this.userId && value['destinataire']==this.destId) || (value['destinataire']==this.userId && value['utilisateur']==this.destId)){
          this.messageVu(doc.id,value)        
        }
      });
    })
  }

   getContent() {
    var x= document.querySelector('ion-content');
    console.log("scroll");
    return x;
  }

   scrollToBottom() {
     
    this.getContent().scrollToBottom();
  }



  trierMessage(messages){
    var newMessageList = Array();

    messages.sort(function(a,b){
      return a.date-b.date;
    })
    console.log(messages);
  }


  messageVu(id,message){
    if(message['utilisateur']!=this.userId && message['destinataire']==this.userId && message['vu']==false){ //le message était pour moi, alors je l'ai vu 
    this.changeMessageVu(id)
    console.log( "changement")
      //return true;
    }else if(message['utilisateur']==this.userId && message['vu']==false){ //le message n'était pas pour moi et il ne l'a pas vu
    console.log( "pas encore changé")
      //return false
    }else if(message['utilisateur']==this.userId && message['vu']==true){ //le message n'était pas pour moi et il l'a  vu
    console.log( "déjà changé")
    //return true
    }
  }


  changeMessageVu(id){
    this.firestore.collection("messages").doc(id).update({
      vu:true
    })
  }

  
  
  getMessages(userId,destId) {
    var that = this;
    const db = this.firestore;
    that.messagesView = [];
    this.messages.subscribe(message =>{
      
      that.messagesView = [];
      message.forEach(value =>{

        if((value['utilisateur']==userId && value['destinataire']==destId) || (value['destinataire']==userId && value['utilisateur']==destId)){
          that.messagesView.push({
            userId: value['utilisateur'],
            destId: value['destinataire'],
            text: value['message'],
            date: value['date'],
            vu: value['vu']
          });
        
        }
      });
      that.trierMessage(that.messagesView);
    })
    
    
  }

  getDest(destId){
    var that = this;
    this.utilisateurs.subscribe(user =>{
      user.forEach(value =>{
        if(value['id']==destId){
          that.destView = value;
        }
      });
    })
  }

  envoyerMessage(){
    this.firestore.collection('messages').add({
      utilisateur: this.userId,
      destinataire: this.destId,
      message: this.messageText,
      date: new Date(),
      vu: false
    });
    this.messageText = '';
    this.scrollToBottom();
  }


}
