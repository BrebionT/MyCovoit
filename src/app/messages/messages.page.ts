import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit{

  messages: Observable<any[]>;
  users: Observable<any[]>;

  public messagesView :Observable<any[]>;
  public photoView : Observable<any[]>;
  public userList = Array();
  public userList2 = Array();
  public photoList = Array();

  public connected= false;
  public userId;
  public destId;

  public update;
  test;
  liste_vu;
  notif;
  liste_user;

  constructor(
    public afAuth: AngularFireAuth,
    public firestore: AngularFirestore,
    public afDB: AngularFireDatabase,
    private router: Router,
    public afSG: AngularFireStorage
  ) {
    if(this.userId == undefined || this.userId == null ){
      this.afAuth.authState.subscribe(auth => {
        if (!auth) {
          this.router.navigateByUrl('/connexion');
          this.connected = false;
        } else {
          this.userId = auth.uid;
          this.connected = true;
          this.userList2 = [];
          this.liste_user = [];
          if(this.userId!= undefined && this.userId!= null ){
            this.getUsers(this.userId);
          }
          //this.messages = this.firestore.collection("messages").valueChanges();
          //this.users = this.firestore.collection("utilisateurs").valueChanges();
          //this.getUsers(this.userId);
        }});
      }
    
  }

  ngOnInit(){
    this.userList2 = [];
    if(this.userId == undefined || this.userId == null ){
      this.afAuth.authState.subscribe(auth => {
        if (auth) {
          this.userId = auth.uid;
          this.getUsers(this.userId);
        }});
      }
  }

  goConvers(id){
    this.userList2 = [];
    this.liste_user = [];
    this.router.navigateByUrl('/conversation#'+id);
    
  }

  ionViewWillLeave(){
    //console.log('sortir page messages')
    this.userList2 = [];
    this.messagesView = null;
    this.liste_user = [];
    //console.log('liste : ',this.messagesView)
  }

  ionViewWillEnter(){
    //console.log('entrer page messages')
    this.userList2 = [];
    this.liste_user = [];
    if(this.userId!= undefined && this.userId!= null ){
      this.getUsers(this.userId);
    }
  }

  ngOnDestroy(){
    this.userList2=[];
    this.messagesView=null;
    //console.log("détruit")
  }


  convers(){
    this.router.navigateByUrl('/tabs/conversation');
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
        //console.log(that.photoList)

      });
      return images;
    }

    var that = this;
    this.photoList = []; /// on aura : [{photo:......, user:......}]
    this.liste_vu = [];
    var userSub = this.users;

    this.test = this.firestore.collection("messages_vu");
    this.userList2 = [];
    this.liste_user = [];
        this.test.ref.where("destinataire", '==' , userId);
        this.test.ref.orderBy('date', "desc")
        .onSnapshot(function(querySnapshot) {

          
          
          querySnapshot.forEach(function(doc) {
            if(doc.exists){
              //console.log('existe')
            //console.log(doc.data()['id'])
            var destTest = doc.data()['id'].slice(-28);
            //console.log('destid : ',destTest)
            

            if(doc.data()['utilisateur'] != userId){
              //console.log(destTest,'est inclus : ',that.liste_user.includes(destTest))
              if(!that.liste_user.includes(doc.data()['utilisateur'])){
                that.liste_user.push(doc.data()['utilisateur'])
                
                //console.log('dest : ',destTest)
                var user;
                user = that.firestore.collection("utilisateurs").doc(doc.data()['utilisateur']);
                user.ref.get()
                .then((doc2)=>{
                  if (doc2.exists) {
                    //console.log('message : ',doc.data()['message'])
                    getImagesStorage(that,doc2.data()['photo'],doc2.data()['id'])
                    if(doc.data()['archive']== false && doc.data()['archiveDest']== false){
                      that.userList2.push([doc.data()['utilisateur'],doc2.data()['prenom'],doc2.data()['nom'],doc.data()['date'],doc.data()['message'],doc.data()['vu'],doc.data()['destinataire'],doc.data()['id']])
                    }else if(doc.data['archive']== false && doc.data['archiveDest']== true){
                      that.userList2.push([doc.data()['utilisateur'],doc2.data()['prenom'],doc2.data()['nom'],doc.data()['date'],"Vous ne souhaitez pas afficher ce message",doc.data()['vu'],doc.data()['destinataire'],doc.data()['id']])
                    }else if(doc.data['archive']== true){
                      that.userList2.push([doc.data()['utilisateur'],doc2.data()['prenom'],doc2.data()['nom'],doc.data()['date'],"Ce message a été supprimé",doc.data()['vu'],doc.data()['destinataire'],doc.data()['id']])
                    }
                
              } else {
                  //console.log("Document non trouvé!");
              }
                })
              }
            }
          }
          })
          //that.userList2.reverse()
          that.messagesView = of(that.userList2) ;
          that.photoView = of(that.photoList);
        })


    /* this.messages.subscribe(message =>{
      message.forEach(value =>{

        const db = this.firestore;

        this.test = this.firestore.collection("messages_vu");
        this.test.ref.where("destinataire", 'in' , [value['destinataire'],value['utilisateur']]);
        this.test.ref.where("utilisateur", 'in' , [value['destinataire'],value['utilisateur']]);
        this.test.ref.orderBy('id')
        .onSnapshot(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            if(doc.data()['vu']==false){
              that.notif = true;
            }
          })
        })

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
    //console.log(that.photoList);
    
    that.messagesView = of(that.userList2);
    that.photoView = of(that.photoList);
      }) */
      
      //console.log(that.userList2)
      return true;
    
  }

  delete(id){
    //console.log(id)
    this.firestore.collection("messages_vu").doc(id).delete().then(() => {
      console.log("Message_vu supprimé");
    }).catch((error) => {
        console.error("Erreur : ", error);
    });
  }
  
  

}
