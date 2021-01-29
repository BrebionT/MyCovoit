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
export class ConversationPage implements OnInit{
  
  @ViewChild(IonContent) content: IonContent;

  startPress;
  endPress;
  public duree;

  startPress2;
  endPress2;
  public duree2;

  selected=[];
  selected2=[];

  public messageiddata;
  public message;

  connected= true;
  public userId;
  public destId;

  test;

  public images = "";

  messageText: any;
  
  public messagesView;
  public messagesViewBIS = Array();
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
    public afSG: AngularFireStorage
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
        var that=this;
        //this.messagesView.forEach((message)=> that.selected[message.id]=false)
        
        setTimeout(() => {
          this.content.scrollToBottom(300);
       }, 1000);
        
      }
    });
  }

  ionPageDidLoad()
  {
     setTimeout(() => {
        this.content.scrollToBottom(300);
     }, 1000);
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

  trierMessage(messages){
    messages.sort(function(a,b){
      return b.date-a.date;
    })
  }


  messageVu(id,message){
    if(message['utilisateur']!=this.userId && message['destinataire']==this.userId && message['vu']==false){ //le message était pour moi, alors je l'ai vu 
      this.changeMessageVu(id)
    }
  }


  changeMessageVu(id){
    this.firestore.collection("messages").doc(id).update({
      vu:true
    })
  }

  pressDown(){
    this.startPress = Date.now();
    console.log('press')
  }

  pressUp(){
    var that = this;
    this.endPress = Date.now();
    console.log('up')

    this.duree = (this.endPress - this.startPress)/1000;
    
    /* if(this.duree>0.5){
      setTimeout(() => {
        this.content.scrollToBottom(300);
     }, 30);
    } */
  }

  pressDown2(){
    this.startPress2 = Date.now();
    console.log('press')
  }

  pressUp2(){
    var that = this;
    this.endPress2 = Date.now();
    console.log('up')

    this.duree2 = (this.endPress2 - this.startPress2)/1000;

  }
  
  getMessages(userId,destId) {

    /*
    var that = this;
    const db = this.firestore;
    
    that.messagesView = [];
    this.messages.subscribe(message =>{
      console.log('subscribe')
      that.messagesView = [];
      message.forEach(value =>{
        console.log('message')
        if((value['utilisateur']==userId && value['destinataire']==destId) || (value['destinataire']==userId && value['utilisateur']==destId)){
          
          this.messagesView.push({
            id: value['id'],
            userId: value['utilisateur'],
            destId: value['destinataire'],
            text: value['message'],
            date: value['date'],
            vu: value['vu'],
            archive: value['archive']
          });
        }
      });
      
      
      
      that.trierMessage(this.messagesView);
      this.messagesView.reverse();
      
    })
    
    */
    var that = this;
    this.test = this.firestore.collection("messages");
    this.test.ref.where("destinataire", "in", [destId, userId]);
    this.test.ref.where("utilisateur", "in", [destId, userId]);
    this.test.ref.orderBy('date')
    .onSnapshot(function(querySnapshot) {
      that.messagesView=[]
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            //console.log(typeof(doc.data()))
            that.messagesView.push(doc.data())
        });
    })
  }

  presentPopover(message){
    console.log(message.id)
  }

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

  getImagesStorage(image: any) {
    //console.log(image)
    this.afSG.ref('users/'+image).getDownloadURL().subscribe(imgUrl => {
      //console.log(imgUrl);
      this.images= imgUrl;
    });
    //console.log(this.images)
  }

  envoyerMessage(){
    if(this.messageText != undefined && this.messageText.trim() != ""){
      this.firestore.collection('messages').add({
        id: new Date().getTime(),
        utilisateur: this.userId,
        destinataire: this.destId,
        message: this.messageText.trim(),
        date: new Date(),
        vu: false,
        archive:false,
        archiveDest:false
      });
      this.messageText = '';
      var that = this;
      setTimeout(() => {
        that.content.scrollToBottom(300);
     }, 30);
      
    }
    
  }

  getTrail(value){
    console.log(value)
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
    console.log(this.selected)
    
  }

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

  supprimerMessage(sel){
    var that = this;
    this.firestore.collection("messages").get().toPromise().then((snapshot)=>{
      snapshot.docs.forEach(doc =>{
        if(doc.data()['id']==sel){
          that.firestore.collection("messages").doc(doc.id).update({
            archive:true
          })

          /* this.messageiddata = doc.id;
          this.message = {
            archive: doc.data()['archive'],
            date: doc.data()['date'],
            destinataire: doc.data()['destinataire'],
            id: doc.data()['id'],
            message: doc.data()['message'],
            utilisateur: doc.data()['utilisateur'],
            vu: doc.data()['vu']
          }; */
        }
      })
    })
  }

  supprimer(selected){
    console.log('selected : ',selected)
    console.log('select length : ',selected.length)
    for(var i=0;i<selected.length;i++){
      console.log(i)
      var sel = selected[i];
      console.log(selected[i])
      this.supprimerMessage(sel)
      
    }
    
    this.duree=0;
    
    this.selected=[];
    var that = this;
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

          /* this.messageiddata = doc.id;
          this.message = {
            archive: doc.data()['archive'],
            date: doc.data()['date'],
            destinataire: doc.data()['destinataire'],
            id: doc.data()['id'],
            message: doc.data()['message'],
            utilisateur: doc.data()['utilisateur'],
            vu: doc.data()['vu']
          }; */
        }
      })
    })
  }

  supprimer2(selected){
    console.log('selected : ',selected)
    console.log('select length : ',selected.length)
    for(var i=0;i<selected.length;i++){
      console.log(i)
      var sel = selected[i];
      console.log(selected[i])
      this.supprimerMessage2(sel)
      
    }
    
    this.duree2=0;
    
    this.selected2=[];
    var that = this;
    setTimeout(() => {
      this.content.scrollToBottom(300);
   }, 1000);
  }


}
