import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import {boole} from '../../environments/environment';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit{

  messages: Observable<any[]>;
  users: Observable<any[]>;

  public messagesView : Observable<any[]>;
  public photoView : Observable<any[]>;
  public userList = Array();
  public userList2 = Array();
  public photoList = Array();

  public connected= false;
  public userId;
  public destId;

  public update;
  

  constructor(
    public afAuth: AngularFireAuth,
    public firestore: AngularFirestore,
    public afDB: AngularFireDatabase,
    private router: Router,
    public afSG: AngularFireStorage
  ) {
    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        this.router.navigateByUrl('/connexion');
        this.connected = false;
      } else {
        this.userId = auth.uid;
        this.connected = true;
        this.messages = this.firestore.collection("messages").valueChanges();
        this.users = this.firestore.collection("utilisateurs").valueChanges();
        this.getUsers(this.userId);
      }});

    
  }

  ngOnInit(){
    this.firestore.collection("messages").valueChanges().subscribe(message =>{
      this.update = message;
    })
  }

  ionViewWillEnter(){
  }

  ngOnDestroy(){
    this.userList2=[];
    this.messagesView=null;
    //console.log("détruit")
  }


  convers(){
    this.router.navigateByUrl('/tabs/conversation');
  }

  trierMessage(messages){
    var newMessageList = Array();

    messages.sort(function(a,b){
      return b[1]-a[1];
    })
    //console.log(messages);
  }

  getUsers(userId){

    function getImagesStorage(that,image: any,id) {
      var images;
      //console.log("getImagesStorage")
      that.afSG.ref('users/'+image).getDownloadURL().subscribe(imgUrl => {
        images= imgUrl;

        for(var j=0;j<that.photoList.length;j++){
          if(that.photoList[j].user==id){
            that.photoList[j].user=undefined;
          }
        }

        that.photoList.push({photo:images, user:id})

      });
      return images;
    }

    var that = this;
    this.userList = [];
    this.userList2 = [];
    this.photoList = []; /// on aura : [{photo:......, user:......}]
    var userSub = this.users;
    this.messages.subscribe(message =>{
      message.forEach(value =>{

        if(value['utilisateur']==userId){  // J'ai envoyé un message

          const found = that.userList.find(element => element == value['destinataire']); //Est ce que l'autre personne est déjà enregistrée.

          if(found == undefined){ // Il n'est pas enregistré


            userSub.subscribe(uti =>{ 

              uti.forEach(user => {
                if(user['id']==value['destinataire']){
                  getImagesStorage(that,user['photo'],user['id'])
                }
              })})

            /// On l'enregistre ///
            that.userList.push(value['destinataire']);
            if(value['archive']==true){
              that.userList2.push([value['destinataire'],value['date'],"Ce message a été supprimé",value["vu"],value["utilisateur"]]);
            }else if(value['archiveDest']==true){
              that.userList2.push([value['destinataire'],value['date'],value['message'],value["vu"],value["utilisateur"]]);
            }else{
              that.userList2.push([value['destinataire'],value['date'],value["message"],value["vu"],value["utilisateur"]]);
            }

          }else{
            for(var i=0; i<that.userList2.length;i++){  //Nous allons le chercher parmis la liste des personnes
              if(that.userList2[i][0]==value['destinataire']){ //Il s'agit de lui
                if(that.userList2[i][1]<value['date']){ //Le message a été envoyé plus tard que celui qui est enregistré
                  that.userList2[i][0]=undefined;

                  userSub.subscribe(uti =>{ 

                    uti.forEach(user => {
                      if(user['id']==value['destinataire']){

                        getImagesStorage(that,user['photo'],user['id'])
                      }
                    })})

                  that.userList.push(value['destinataire']);
                  if(value['archive']==true){
                    that.userList2.push([value['destinataire'],value['date'],"Ce message a été supprimé",value["vu"],value["destinataire"]]);
                  }else if(value['archiveDest']==true){
                    that.userList2.push([value['destinataire'],value['date'],"Vous avez supprimé ce message",value["vu"],value["destinataire"]]);
                  }else{
                    that.userList2.push([value['destinataire'],value['date'],value["message"],value["vu"],value["destinataire"]]);
                  }
                  
                  

                }
              }
            }
          }

        }else if (value['destinataire']==userId){ //J'ai reçu un message

          const found = that.userList.find(element => element == value['utilisateur']); //Est ce que l'autre personne est déjà enregistrée.

          if(found == undefined){ // Il n'est pas enregistré

            userSub.subscribe(uti =>{ 

              uti.forEach(user => {
                if(user['id']==value['utilisateur']){
                  getImagesStorage(that,user['photo'],user['id'])
                }
              })})

            /// On l'enregistre ///
            that.userList.push(value['utilisateur']);
            if(value['archive']==true){
              that.userList2.push([value['utilisateur'],value['date'],"Ce message a été supprimé",value["vu"],value["destinataire"]]);
            }else if(value['archiveDest']==true){
              that.userList2.push([value['utilisateur'],value['date'],"Vous avez supprimé ce message",value["vu"],value["destinataire"]]);
            }else{
              that.userList2.push([value['utilisateur'],value['date'],value["message"],value["vu"],value["destinataire"]]);
            }

          }else{
            for(var i=0; i<that.userList2.length;i++){  //Nous allons le chercher parmis la liste des personnes
              if(that.userList2[i][0]==value['utilisateur']){ //Il s'agit de lui
                if(that.userList2[i][1]<value['date']){ //Le message a été envoyé plus tard que celui qui est enregistré
                  that.userList2[i][0]=undefined;

                  userSub.subscribe(uti =>{ 

                    uti.forEach(user => {
                      if(user['id']==value['utilisateur']){
                        
                        getImagesStorage(that,user['photo'],user['id'])
                      }
                    })})

                  that.userList.push(value['utilisateur']);
                  if(value['archive']==true){
                    that.userList2.push([value['utilisateur'],value['date'],"Ce message a été supprimé",value["vu"],value["destinataire"]]);
                  }else if(value['archiveDest']==true){
                    that.userList2.push([value['utilisateur'],value['date'],"Vous avez supprimé ce message",value["vu"],value["destinataire"]]);
                  }else{
                    that.userList2.push([value['utilisateur'],value['date'],value["message"],value["vu"],value["destinataire"]]);
                  }
                
                  

                }
              }
            }
          }
          that.trierMessage(that.userList2)

        }

      });
    //console.log(that.userList);
    console.log(that.photoList);
    
    that.messagesView = of(that.userList2);
    that.photoView = of(that.photoList);
      })
    return true;
    
  }
  

}
