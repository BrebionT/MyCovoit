import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-trajet-detail',
  templateUrl: './trajet-detail.page.html',
  styleUrls: ['./trajet-detail.page.scss'],
})
export class TrajetDetailPage implements OnInit {

  userid;

  trajet;
  etapes;
  utilisateur;
  avis;
  roles;

  trajet_id;

  trajetId;
  etapesId;
  uti_traId;
  uti_trajet;

  avisValue =0;
  nbAvis =0;
  avisTotal;
   

  constructor(
    public firestore: AngularFirestore,
    public afSG: AngularFireStorage,
    public afAuth: AngularFireAuth,
    private router: Router,
  ) {

    this.trajet_id= this.router.url.slice(-24);
    this.etapes = [];

    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        this.userid = auth.uid;
      }
    })
    //console.log(this.trajet)
  }
  ionViewWillEnter(){

    this.trajet_id= this.router.url.slice(-24);
    this.etapes = [];
    this.etapesId = [];
    this.uti_traId = [];

    var that = this;

    that.firestore.collection("trajets").get().toPromise().then((snapshot)=>{
      snapshot.docs.forEach(doc =>{
        if(doc.data()['tra_id']==that.trajet_id){
          that.trajetId = doc.id;
          that.trajet = doc.data();

          that.trajet.tra_dateDepart = new Date(that.trajet.tra_dateDepart).toLocaleString('fr-FR',{
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            });

            that.firestore.collection("etapes").get().toPromise().then((snapshot1)=>{
            snapshot1.docs.forEach(doc1 =>{
              //console.log("trajet ?")
              if(doc1.data()['eta_idTra']== doc.data()['tra_id']){
                //console.log("ok")
                if(!that.etapesId.includes(doc1.id)){
                  that.etapesId.push(doc1.id)
                }
                that.etapes.push(doc1.data());
              }

              that.trajet.tra_dateDepart = that.trajet.tra_dateDepart.charAt(0).toUpperCase()+that.trajet.tra_dateDepart.substr(1)
                //console.log(this.trajet.tra_dateDepart);
                
                that.firestore.collection("utilisateur_trajet").get().toPromise().then((snapshot2)=>{
                  snapshot2.docs.forEach(doc2 =>{
                    if(doc2.data()['uti_tra_idTra']==doc.data()['tra_id']){
                      if(doc2.data()['uti_tra_role']=="Conducteur"){
                        that.uti_trajet = doc2.data()['uti_tra_idUti']
                      }

                      if(!that.uti_traId.includes({id:doc2.id,uti:doc2.data()['uti_tra_idUti']})){
                        that.uti_traId.push({id:doc2.id,uti:doc2.data()['uti_tra_idUti']})
                      }
                      that.uti_traId.push({id:doc2.id,uti:doc2.data()['uti_tra_idUti']})

                      if(doc2.data()['uti_tra_idUti']==that.userid){
                        that.roles = doc2.data()['uti_tra_role']
                      

                        that.firestore.collection("utilisateurs").get().toPromise().then((snapshot3)=>{
                          snapshot3.docs.forEach(doc3 =>{
                            if(doc3.data()['id']==that.uti_trajet){

                              that.utilisateur = doc3.data()
                              that.afSG.ref('users/'+doc3.data()['photo']).getDownloadURL().subscribe(imgUrl => {
                                that.utilisateur['photo'] = imgUrl;
                              })

                              that.firestore.collection("avis").get().toPromise().then((snapshot4)=>{
                                that.nbAvis =0;
                                that.avisValue=0;
                                that.avisTotal=0;
                                snapshot4.docs.forEach(doc4=>{
                                  if(doc4.data()['destinataire']==that.uti_trajet){
                                    console.log('avis +1')
                                    that.nbAvis+=1;
                                    that.avisValue+=doc4.data()['note'];
                                    that.avisTotal = (that.avisValue / that.nbAvis)
                                    //console.log(this.avisTotal.toString().indexOf('.'))
                                    if(that.avisTotal.toString().indexOf('.') != -1){
                                      that.avisTotal=that.avisTotal.toFixed(2);
                                    }
                                  }
                                })
                              })

                            }
                          })
                        })
                      }
                    }
                  })
                })
              
            })
          })
        }
      })
    })
   }


   getImagesStorage(traj, uti) {
    var that = this;
    var img = uti['photo'];
    this.afSG.ref('users/'+img).getDownloadURL().subscribe(imgUrl => {
      //that.liste_trajetdispo.push({trajet:traj, utilisateur:uti, photo:imgUrl});
    });
  }

  ngOnInit() {
  }

  envoyerMessage(userId,destId,message){
    var date_envoie = new Date();
      this.firestore.collection('messages').add({
        id: new Date().getTime(),
        utilisateur: userId,
        destinataire: destId,
        message: message,
        date: date_envoie,
        archive:false,
        archiveDest:false
      });

      var that = this;
      var db = this.firestore;
      var docRef = db.collection("messages_vu").doc(userId+destId);

      docRef.ref.get().then((doc) => {
          if (doc.exists) {
              //console.log("Document data:", doc.data());
              this.firestore.collection("messages_vu").doc(userId+destId).update({
                message: message,
                date: date_envoie,
                vu:false
              })
              this.firestore.collection("messages_vu").doc(destId+userId).update({
                message: message,
                date: date_envoie,
                vu:true
              })
              
          } else {
              // doc.data() n'est pas défini
              //console.log("No such document!");
              db.collection("messages_vu").doc(userId+destId).set({
                id: userId+destId,
                utilisateur: userId,
                destinataire: destId,
                message: message,
                date: date_envoie,
                archive:false,
                archiveDest:false,
                vu:false
              });
              db.collection("messages_vu").doc(destId+userId).set({
                id: destId+userId,
                utilisateur: destId,
                destinataire: userId,
                message: message,
                date: date_envoie,
                archive:false,
                archiveDest:false,
                vu:true
              });
          }
      }).catch((error) => {
          //console.log("Error getting document:", error);
      });      
    
  }

  supprimer(){

    // trajetId : id à supprimer
    this.firestore.collection("trajets").doc(this.trajetId).delete().then(() => {
      console.log("Trajet supprimé");
    }).catch((error) => {
        console.error("Erreur : ", error);
    });

    for(var i =0; i<this.etapesId.length;i++){
      this.firestore.collection("etapes").doc(this.etapesId[i]).delete().then(() => {
        console.log("Etape supprimé");
      }).catch((error) => {
          console.error("Erreur : ", error);
      });
    }

    var liste_user = [];
    for(var j =0; j<this.uti_traId.length;j++){
      if(this.uti_traId[j].uti != this.userid){
        console.log(this.uti_traId[j].uti , this.userid)
        if(!liste_user.includes(this.uti_traId[j].uti)){
          liste_user.push(this.uti_traId[j].uti)
          this.envoyerMessage(this.userid,this.uti_traId[j].uti,"IMPORTANT : Le trajet a été supprimé.")
        }
      }
      this.firestore.collection("utilisateur_trajet").doc(this.uti_traId[j].id).delete().then(() => {
        console.log("Utilisateur_Trajet supprimé");
      }).catch((error) => {
          console.error("Erreur : ", error);
      });
    }

    this.router.navigateByUrl('/tabs/tableaubord');
  }

  annuler(){
    var liste_user = []
    for(var j =0; j<this.uti_traId.length;j++){
      if(this.uti_traId[j].uti == this.userid){
        this.firestore.collection("utilisateur_trajet").doc(this.uti_traId[j].id).delete().then(() => {
          console.log("Utilisateur_Trajet supprimé");
        }).catch((error) => {
            console.error("Erreur : ", error);
        });
        
      }
      if(this.uti_traId[j].uti== this.uti_trajet){
        if(!liste_user.includes(this.uti_traId[j].uti)){
          liste_user.push(this.uti_traId[j].uti)
          this.envoyerMessage(this.userid,this.uti_trajet,"IMPORTANT : J'ai annulé le trajet.")
        }
        
      }
      
    }

    this.router.navigateByUrl('/tabs/tableaubord');
  }

  ionViewWillLeave(){

    this.etapes = undefined;
    this.avis = undefined;

    this.trajet_id= undefined;

    this.trajetId= undefined;
    this.etapesId=undefined;
    this.uti_traId=undefined;

    this.roles = undefined;

    this.avisValue =0;
    this.nbAvis =0;
    this.avisTotal= undefined;
    this.trajet = undefined;
    this.utilisateur = undefined;
  }

}
