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

  public messagesView :Observable<any[]>; // Variable pour les messages qu'on va afficher
  public photoView : Observable<any[]>; // Variable pour les photos des utilisateurs qu'on va afficher


  public userList2 = Array(); // Tableau temporaire qui va nous servir pour afficher les messages / utilisateurs dans l'ordre.
  public photoList = Array(); // Tableau temporaire qui va nous servir pour afficher les photos des utilisateurs dans l'ordre.

  public userId;

  public messages_vu;
  public liste_user;

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
        } else {
          this.userId = auth.uid;
          this.userList2 = [];
          this.liste_user = [];
          if(this.userId!= undefined && this.userId!= null ){
            this.getUsers(this.userId);
          }
        }});
      }
    
  }

  // Fonction lancée dès que la page est chargée. ( Même fonction que dans le constructeur au cas où il y a un bug / délai )
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

  // Fonction pour se diriger vers la conversation avec la personne cliquée.
  goConvers(id){
    this.userList2 = [];
    this.liste_user = [];
    this.router.navigateByUrl('/conversation#'+id);
    
  }

  // Fonction lancée dès que la vue de la page n'est plus visible -> on change de page.
  ionViewWillLeave(){
    this.userList2 = [];
    this.messagesView = null;
    this.liste_user = [];
  }

  // Fonction lancée dès que nous entrons dans la page ( vue ).
  ionViewWillEnter(){
    this.userList2 = [];
    this.liste_user = [];
    if(this.userId!= undefined && this.userId!= null ){
      this.getUsers(this.userId);
    }
  }

  // Fonction lancée dès que la page est "détruite"
  ngOnDestroy(){
    this.userList2=[];
    this.messagesView=null;
  }


  getUsers(userId){

    // On récupère la photo de l'autre utilisateur.
    function getImagesStorage(that,image: any,id) {
      var images;
      that.afSG.ref('users/'+image).getDownloadURL().subscribe(imgUrl => {
        images= imgUrl;

        // Nous parcourons la liste des photo pour savoir si nous l'avons déjà : si oui on le met à undefined
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
    this.photoList = []; /// on aura : [{photo:......, user:......}]

    this.messages_vu = this.firestore.collection("messages_vu");
    this.userList2 = [];
    this.liste_user = [];

    // On va regarder mes messages_vu afin de voir pour changer le design des messages ( gras pour un message non lu, ...). 
    this.messages_vu.ref.where("destinataire", '==' , userId);
    this.messages_vu.ref.orderBy('date', "desc")
      .onSnapshot(function(querySnapshot) {

          
          
        querySnapshot.forEach(function(doc) {
          if(doc.exists){            

            if(doc.data()['utilisateur'] != userId){
              if(!that.liste_user.includes(doc.data()['utilisateur'])){
                that.liste_user.push(doc.data()['utilisateur'])
                
                var user;
                user = that.firestore.collection("utilisateurs").doc(doc.data()['utilisateur']);
                user.ref.get()
                .then((doc2)=>{
                  if (doc2.exists) {
                    getImagesStorage(that,doc2.data()['photo'],doc2.data()['id'])
                    if(doc.data()['archive']== false && doc.data()['archiveDest']== false){
                      that.userList2.push([doc.data()['utilisateur'],doc2.data()['prenom'],doc2.data()['nom'],doc.data()['date'],doc.data()['message'],doc.data()['vu'],doc.data()['destinataire'],doc.data()['id']])
                    }else if(doc.data['archive']== false && doc.data['archiveDest']== true){
                      that.userList2.push([doc.data()['utilisateur'],doc2.data()['prenom'],doc2.data()['nom'],doc.data()['date'],"Vous ne souhaitez pas afficher ce message",doc.data()['vu'],doc.data()['destinataire'],doc.data()['id']])
                    }else if(doc.data['archive']== true){
                      that.userList2.push([doc.data()['utilisateur'],doc2.data()['prenom'],doc2.data()['nom'],doc.data()['date'],"Ce message a été supprimé",doc.data()['vu'],doc.data()['destinataire'],doc.data()['id']])
                    }
                
                  }
                })
              }
            }
          }
          })
          that.messagesView = of(that.userList2) ;
          that.photoView = of(that.photoList);
        })

      return true;
    
  }

  // Fonction qui supprime la conversation ( par le message_vu ).
  delete(id){
    this.firestore.collection("messages_vu").doc(id).delete().then(() => {
    }).catch((error) => {
        console.error("Erreur : ", error);
    });
    this.userList2 = [];
    this.messagesView = null;
    this.liste_user = [];
    if(this.userId!= undefined && this.userId!= null ){
      this.getUsers(this.userId);
    }
  }
  
  

}
