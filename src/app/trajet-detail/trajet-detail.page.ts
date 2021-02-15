import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import {Observable} from 'rxjs';
import {NavController, NavParams} from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-trajet-detail',
  templateUrl: './trajet-detail.page.html',
  styleUrls: ['./trajet-detail.page.scss'],
})
export class TrajetDetailPage implements OnInit {
  public connected: boolean = false;
  public trajetfait :boolean = false;
  utilisateurs: Observable<any[]>;
  trajets: Observable<any[]>;
  trajets2: Observable<any[]>;
  today = new Date();

  
  userid;

  trajet;
  etapes;
  utilisateur;
  avis;
  roles;

  liste_users = [];

  trajet_id;

  trajetId;
  etapesId;
  uti_traId;
  uti_trajet;

  avisValue =0;
  nbAvis =0;
  avisTotal;
  uti_tra2: Observable<any[]>;
  liste_dates = [];
  uti_tra: Observable<any[]>;

  dateTrajet;

  

  constructor(
    public firestore: AngularFirestore,
    public afSG: AngularFireStorage,
    public afAuth: AngularFireAuth,
    private router: Router,
    public toastController: ToastController,   
    public afDB: AngularFireDatabase,
    public alertController: AlertController,
    public navCtrl:NavController
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

  ngOnDestroy(){
    console.log("detruit");
    this.liste_dates=[];
    this.liste_users = [];
    this.trajetfait=false;
    this.utilisateurs=null;
    this.trajets=null;
    this.uti_tra=null;
    this.trajets2=null;
    this.uti_tra2=null;
  }

  returnConnected(){
    return this.connected;
  }

  getAuth(){
    this.liste_dates = [];
    this.liste_users = [];
    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        this.connected=false;
        this.router.navigateByUrl('/connexion');
      } else {
        this.connected=true;
        this.userid = auth.uid;
      }
    });
  }

  getUtilisateur(){
    var that = this;
    this.utilisateurs.subscribe(uti =>{
      uti.forEach(value => {
        if(value['tra_id']==that.userid){
          that.utilisateur = value;
        }
      })
    });
    
  }



  ionViewWillEnter(){

    this.utilisateurs = this.firestore.collection('utilisateurs').valueChanges();
    this.trajets = this.firestore.collection('trajets').valueChanges();
    this.trajets2 = this.firestore.collection('trajets').valueChanges();
    this.uti_tra = this.firestore.collection('utilisateur_trajet').valueChanges();
    this.uti_tra2 = this.firestore.collection('utilisateur_trajet').valueChanges();

    this.getAuth();
    this.getUtilisateur();
    this.liste_dates = [];
    this.liste_users = [];
    this.getTrajet();

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
          that.dateTrajet = that.trajet.tra_dateDepart;

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

   

 

   async showTrajet(trajet){
    

    async function showAlert(that,options){
      var alert = await that.alertController.create(options);
      alert.present();
    }
    var liste_user_trajet = [];
    if(this.liste_users.length>0){
      for(var i=0;i<this.liste_users.length;i++){
        if(trajet.tra_id==this.liste_users[i].trajet.tra_id){
          liste_user_trajet.push({user:this.liste_users[i].user, role:this.liste_users[i].role})
        }
      }
  
      var options = {
        header: 'Notez un utilisateur',
        message: 'Sélectionner l\'utilisateur que vous souhaitez laisser votre avis.',
        inputs:[],
        buttons: [
          {
            text: 'Quitter',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Ok',
            handler: data => {
              //console.log(data);
              if(data!=undefined){
                const path = '/noter#'+data;
                this.router.navigateByUrl(path);
              }
              
            }
          }
        ],
        
      };
  
      
  
      if(liste_user_trajet.length>0){
        for(var i=0; i< liste_user_trajet.length; i++) {
          let role = "";
          console.log('role dans liste : ',liste_user_trajet[i].role)
          if(liste_user_trajet[i].role){
            role=liste_user_trajet[i].role;
            console.log('role : ',role)
          
          var test = this.firestore.collection("utilisateurs",ref =>ref.where("id", "==", liste_user_trajet[i].user)).valueChanges()
          test.subscribe(utis =>{
            utis.forEach(uti=> {
              console.log('option')
              options['inputs'].push({ name : 'options', value: uti['id'], label: uti['prenom'] + " " + uti['nom']+" ( "+role+" )", type: 'radio' })
            })
          })
        }
        }
        var that = this;
        setTimeout(function(){
          showAlert(that,options);
        },100)
        
      }
    }
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

  test(){
    console.log(new Date(this.dateTrajet))
    console.log(this.today)
    if(new Date(this.dateTrajet) < this.today){
        return true;
    }
    return false;
  }

  ionViewWillLeave(){
    this.liste_dates = [];
    this.liste_users = [];
    this.utilisateurs=null;
    this.trajets=null;
    this.uti_tra=null;
    this.trajets2=null;
    this.uti_tra2=null;

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

  getTrajet(){
    var that = this;
    this.liste_dates = [];
    this.liste_users = [];
  

    this.uti_tra.subscribe(uti =>{
      uti.forEach(value2=> {
        if(value2['uti_tra_idUti']==that.userid){
          if(this.trajets != null){
            this.trajets.subscribe(tra =>{
              
              tra.forEach(value3=> {
                if(value3['tra_id']==value2['uti_tra_idTra']){
                  var date = new Date (value3['tra_dateDepart']);
                  var newDate = date ;
                  if(newDate<this.today){
                    
                    
                    that.trajetfait=true;
                    this.liste_dates.push({date:newDate, trajet:value3, role:value2['uti_tra_role']});
                    this.liste_dates.sort(function(a,b){
                      return b.date - a.date;
                    });
  
                    that.uti_tra2.subscribe(uti_tras2 =>{
                      uti_tras2.forEach(uti_tra2=> {
                        
                        if(value3['tra_id']==uti_tra2['uti_tra_idTra']){
                          if(uti_tra2['uti_tra_idUti'] != this.userid){
                            console.log(uti_tra2)
                            this.liste_users.push({trajet:value3, user:uti_tra2['uti_tra_idUti'], role:uti_tra2['uti_tra_role']});
                            
                          }
                        }
                      })
                    })
                  }
                  
                }
              })
            })
          }
          
        }
      })
    })
      
  }}
