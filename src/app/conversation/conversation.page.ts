import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import {AngularFirestore} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {IonContent} from '@ionic/angular'
import { AngularFireStorage } from '@angular/fire/storage';


@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
})
export class ConversationPage{
  
  @ViewChild(IonContent) content: IonContent; //On déclare la vue pour le scroll

  // Supprimer nos messages
  startPress; // "date" quand on appuye sur un message
  endPress; // "date" quand on lache l'appuye
  duree; // Durée du clic -> pour un long clic

  // Cacher les messages reçus
  startPress2;
  endPress2;
  duree2;

  selected=[]; // Liste des messages que je souhaite supprimer
  selected2=[]; // Liste des messages que je souhaite cacher

  public message; // On utilise cette variable lorsqu'on parcourt la liste des messages dans la page HTML

  // ID des 2 utilisateurs
  public userId;
  public destId;

  messagesSelect; // Variable contenant les messages dont je suis le destinataire ou l'expéditeur

  public images = ""; // Url de l'image de l'autre utilisateur

  messageText: any; // Texte que l'on écrit pour envoyer
  
  public messagesView; // Liste des messages qu'on va afficher

  public destView = { // Autres informations de l'autre utilisateur
    nom: '',
    prenom: ''
  };


  public utilisateurs : Observable<any[]>; // Variable pour trouver l'autre utilisateur
  

  constructor(
    public afAuth: AngularFireAuth,
    public afDB: AngularFireDatabase,
    public firestore: AngularFirestore,
    private router: Router,
    public afSG: AngularFireStorage
  ) {
    

    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        this.router.navigateByUrl('/connexion');
      } else {
        this.userId = auth.uid;
        this.destId = this.router.url.slice(-28); // On récupère l'id de l'autre destinataire dans l'url

        this.utilisateurs = this.firestore.collection('utilisateurs').valueChanges();

        // On récupère toutes les informations de l'autre utilisateur
        this.getDest(this.destId); 
        
        //On récupère tous les messages
        this.getMessages(this.userId,this.destId);
        

        setTimeout(() => {
          this.content.scrollToBottom(300);
       }, 500);
        
      }
    });
  }  

  // Fonction qui trie les messages par date
  trierMessage(messages){
    messages.sort(function(a,b){
      return b.date-a.date;
    })
  }

  // Fonction qui détecte le moment où on commence à presser le message.
  pressDown(){
    this.startPress = Date.now();
  }

  // Fonction qui détecte le moment où on lache la pression du message + on calcule la durée
  pressUp(){
    this.endPress = Date.now();
    this.duree = (this.endPress - this.startPress)/1000;
  }


  // Les mêmes fonctions mais pour les messages du destinataire
  pressDown2(){
    this.startPress2 = Date.now();
  }

  pressUp2(){
    this.endPress2 = Date.now();
    this.duree2 = (this.endPress2 - this.startPress2)/1000;
  }

  
  // Fonction qui récupère les messages.

  getMessages(userId,destId) {

    var that = this;
    this.messagesSelect = this.firestore.collection("messages");
    this.messagesSelect.ref.where("destinataire", "in", [destId, userId]);
    this.messagesSelect.ref.where("utilisateur", "in", [destId, userId]);
    this.messagesSelect.ref.orderBy('date')
    .onSnapshot(function(querySnapshot) {

      // On initialise la liste qui va stocker les messages.
      that.messagesView=[]

      var db = that.firestore;


      // On s'occupe de messages_vu : ça permet de voir s'il existe un message à voir ou vu ( pour notification par exemple )

      // Messages_vu : est-ce que j'ai reçu une notification ?
      var docRef = db.collection("messages_vu").doc(that.destId+that.userId);

      docRef.ref.get().then((doc) => {
          if (doc.exists) {
              db.collection("messages_vu").doc(that.destId+that.userId).update({
                vu:true // On modifie la valeur, même si elle est déjà à true afin de dire qu'on a vu le message.
              })

              // Ajout et suppression d'un message_vu afin d'actualiser la BDD pour que les utilisateurs n'aient plus la notification.
              db.collection("messages_vu").doc(that.destId+that.userId+"test").set({
                id: that.destId+that.userId+"test",
                utilisateur: "that.destId",
                destinataire: "that.userId",
                message: "test",
                date: new Date(),
                archive:false,
                archiveDest:false,
                vu:true
              })
              db.collection("messages_vu").doc(that.destId+that.userId+"test").delete()
              
          } else { // Il n'a pas eu de message échangé entre les utilisateurs.
              db.collection("messages_vu").doc(that.destId+that.userId).set({
                id: that.destId+that.userId,
                utilisateur: that.destId,
                destinataire: that.userId,
                message: doc.data()['message'],
                date: new Date(),
                archive:false,
                archiveDest:false,
                vu:true
              });
          }
      }).catch((error) => {
          console.log("Error :", error);
      });

        querySnapshot.forEach(function(doc) {

            if((doc.data()['utilisateur']== destId && doc.data()['destinataire']== userId) || (doc.data()['utilisateur']== userId && doc.data()['destinataire']== destId)){
              // On ajoute à la liste les messages.  
              that.messagesView.push(doc.data())
            }
            
        });
    })
  }

  // On récupère les informations du destinataire
  getDest(destId){
    var that = this;
    this.utilisateurs.subscribe(user =>{
      user.forEach(value =>{
        if(value['id']==destId){
          that.destView = value;
          that.getImagesStorage(value['photo'])
        }
      });
    })
  }

  // On récupère l'url de l'image dans la BDD
  getImagesStorage(image: any) {
    this.afSG.ref('users/'+image).getDownloadURL().subscribe(imgUrl => {
      this.images= imgUrl;
    });
  }

  // Fonction pour envoyer un message
  envoyerMessage(){
    var date_envoie = new Date();
    var message = this.messageText.trim()
    if(this.messageText != undefined && message != ""){
      this.firestore.collection('messages').add({
        id: new Date().getTime(),
        utilisateur: this.userId,
        destinataire: this.destId,
        message: message,
        date: date_envoie,
        archive:false,
        archiveDest:false
      });

      var that = this;
      var db = this.firestore;
      var docRef = db.collection("messages_vu").doc(this.userId+this.destId);

      docRef.ref.get().then((doc) => {
          if (doc.exists) {
              this.firestore.collection("messages_vu").doc(this.userId+this.destId).update({
                message: message,
                date: date_envoie,
                vu:false
              })
              
              
          } else {
              db.collection("messages_vu").doc(this.userId+this.destId).set({
                id: this.userId+this.destId,
                utilisateur: this.userId,
                destinataire: this.destId,
                message: message,
                date: date_envoie,
                archive:false,
                archiveDest:false,
                vu:false
              });
              
          }
      }).catch((error) => {
          console.log("Error :", error);
      });

      var docRef2 = db.collection("messages_vu").doc(this.destId+this.userId);

      docRef2.ref.get().then((doc2) => {
          if (doc2.exists) {
              
              this.firestore.collection("messages_vu").doc(this.destId+this.userId).update({
                message: message,
                date: date_envoie,
                vu:true
              })
              
          } else {
              
              db.collection("messages_vu").doc(this.destId+this.userId).set({
                id: this.destId+this.userId,
                utilisateur: this.destId,
                destinataire: this.userId,
                message: message,
                date: date_envoie,
                archive:false,
                archiveDest:false,
                vu:true
              });
          }
      }).catch((error) => {
          console.log("Error :", error);
      });

      
      var that = this;
      setTimeout(() => {
        that.content.scrollToBottom(300);
     }, 30);
      
    }
    this.messageText = '';
    
  }

  // Fonction qui récupère les messages sélectionnés
  getTrail(value){
    if(this.selected.includes(value)==false){
      this.selected.push(value)
    }else{
      const index = this.selected.indexOf(value);
      this.selected.splice(index,1);
    }
    if(this.selected2.includes(value)==false){
      this.selected2.push(value)
    }else{
      const index2 = this.selected2.indexOf(value);
      this.selected2.splice(index2,1);
    }
    this.selected.sort();
    this.selected2.sort()
    
  }

  // Fonction qui remet les variables vide
  retour(){
    var that = this;
    this.duree=0;
    
    this.selected=[];
    setTimeout(() => {
      this.content.scrollToBottom(300);
   }, 1000);
  }
  retour2(){
    var that = this;
    this.duree2=0;
    
    this.selected2=[];
    setTimeout(() => {
      this.content.scrollToBottom(300);
   }, 1000);
  }


  // Fonction qui "supprime" le message -> On l'archive en récupérant son id.
  supprimerMessage(sel){
    var that = this;
    this.firestore.collection("messages").get().toPromise().then((snapshot)=>{
      snapshot.docs.forEach(doc =>{
        if(doc.data()['id']==sel){
          that.firestore.collection("messages").doc(doc.id).update({
            archive:true
          })
        }
      })
    })
  }

  // Fonction qui parcours la liste des messages à supprimer et on les surprime.
  supprimer(selected){
    for(var i=0;i<selected.length;i++){
      var sel = selected[i];
      this.supprimerMessage(sel)
    }
    
    this.duree=0;
    this.selected=[];

    setTimeout(() => {
      this.content.scrollToBottom(300);
   }, 1000);
  }

  supprimerMessage2(sel){
    var that = this;
    this.firestore.collection("messages").get().toPromise().then((snapshot)=>{
      snapshot.docs.forEach(doc =>{
        if(doc.data()['id']==sel){
          that.firestore.collection("messages").doc(doc.id).update({
            archiveDest:true
          })
        }
      })
    })
  }

  supprimer2(selected){
    for(var i=0;i<selected.length;i++){
      var sel = selected[i];
      this.supprimerMessage2(sel)
      
    }
    
    this.duree2=0;
    this.selected2=[];

    setTimeout(() => {
      this.content.scrollToBottom(300);
   }, 1000);
  }


}
