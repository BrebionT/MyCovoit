import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage{

  messages: Observable<any[]>;
  users: Observable<any[]>;

  public messagesView : Observable<any[]>;
  public userList = Array();
  public userList2 = Array();

  public connected= false;
  public userId;
  public destId;

  constructor(
    public afAuth: AngularFireAuth,
    public firestore: AngularFirestore,
    public afDB: AngularFireDatabase,
    private router: Router
  ) {
    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        this.router.navigateByUrl('/tabs/tab2');
        this.connected = false;
      } else {
        this.userId = auth.uid;
        this.connected = true;
        this.messages = this.firestore.collection("messages").valueChanges();
        this.users = this.firestore.collection("utilisateurs").valueChanges();
        this.getUsers(this.userId);
        
      }});

    
  }

  ngOnDestroy(){
    console.log("détruit")
  }

  changerVu(destId){
   
    var that = this;
    const db = this.firestore;
    db.collection("messages").get().toPromise().then((snapshot)=>{
      snapshot.docs.forEach(doc =>{
        //console.log(doc.id, doc.data()['utilisateur']) //     doc.data()['utilisateur']

        var value = doc.data();

        if((value['utilisateur']==this.userId && value['destinataire']==destId) || (value['destinataire']==this.userId && value['utilisateur']==destId)){
          this.messageVu(doc.id,value)        
        }
      });
    })
    
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

  convers(){
    this.router.navigateByUrl('/tabs/conversation');
  }

  getUsers(userId){
    var that = this;
    this.userList = [];
    this.userList2 = [];
    this.messages.subscribe(message =>{
      message.forEach(value =>{

        if(value['utilisateur']==userId){  // J'ai envoyé un message

          const found = that.userList.find(element => element == value['destinataire']); //Est ce que l'autre personne est déjà enregistrée.

          if(found == undefined){ // Il n'est pas enregistré

            /// On l'enregistre ///
            that.userList.push(value['destinataire']);
            that.userList2.push([value['destinataire'],value['date'],value["message"],value["vu"],value["utilisateur"]]);

          }else{
            for(var i=0; i<that.userList2.length;i++){  //Nous allons le chercher parmis la liste des personnes
              if(that.userList2[i][0]==value['destinataire']){ //Il s'agit de lui
                if(that.userList2[i][1]<value['date']){ //Le message a été envoyé plus tard que celui qui est enregistré
                  that.userList2[i][0]=undefined;
                  that.userList.push(value['destinataire']);
                  that.userList2.push([value['destinataire'],value['date'],value["message"],value["vu"],value["destinataire"]]);

                }
              }
            }
          }

        }else if (value['destinataire']==userId){ //J'ai reçu un message

          const found = that.userList.find(element => element == value['utilisateur']); //Est ce que l'autre personne est déjà enregistrée.

          if(found == undefined){ // Il n'est pas enregistré

            /// On l'enregistre ///
            that.userList.push(value['utilisateur']);
            that.userList2.push([value['utilisateur'],value['date'],value["message"],value["vu"],value['destinataire']]);

          }else{
            for(var i=0; i<that.userList2.length;i++){  //Nous allons le chercher parmis la liste des personnes
              if(that.userList2[i][0]==value['utilisateur']){ //Il s'agit de lui
                if(that.userList2[i][1]<value['date']){ //Le message a été envoyé plus tard que celui qui est enregistré
                  that.userList2[i][0]=undefined;
                  that.userList.push(value['utilisateur']);
                  that.userList2.push([value['utilisateur'],value['date'],value["message"],value["vu"],value['destinataire']]);

                }
              }
            }
          }

        }

      });
    //console.log(that.userList);
    console.log(that.userList2);
    that.messagesView = of(that.userList2.reverse());
      })
    return true;
    
  }
  

}
