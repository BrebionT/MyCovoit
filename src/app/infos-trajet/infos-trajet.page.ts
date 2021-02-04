import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-infos-trajet',
  templateUrl: './infos-trajet.page.html',
  styleUrls: ['./infos-trajet.page.scss'],
})
export class InfosTrajetPage implements OnInit {

  userid;

  trajet;
  etapes;
  utilisateur;
  avis;

  trajet_id;

  trajetId;

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

    var that = this;

    this.firestore.collection("trajets").get().toPromise().then((snapshot)=>{
      snapshot.docs.forEach(doc =>{
        if(doc.data()['tra_id']==that.trajet_id){
          this.trajetId = doc.id;
          this.trajet = doc.data();

          this.trajet.tra_dateDepart = new Date(this.trajet.tra_dateDepart).toLocaleString('fr-FR',{
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            });

          this.firestore.collection("etapes").get().toPromise().then((snapshot1)=>{
            snapshot1.docs.forEach(doc1 =>{
              console.log("trajet ?")
              if(doc1.data()['eta_idTra']== doc.data()['tra_id']){
                console.log("ok")
                this.etapes.push(doc1.data());
              }

                this.trajet.tra_dateDepart = this.trajet.tra_dateDepart.charAt(0).toUpperCase()+this.trajet.tra_dateDepart.substr(1)
                //console.log(this.trajet.tra_dateDepart);
                
                this.firestore.collection("utilisateur_trajet").get().toPromise().then((snapshot2)=>{
                  snapshot2.docs.forEach(doc2 =>{
                    if(doc2.data()['uti_tra_idTra']==doc.data()['tra_id'] && doc2.data()['uti_tra_role'] == "Conducteur"){

                      this.firestore.collection("utilisateurs").get().toPromise().then((snapshot3)=>{
                        snapshot3.docs.forEach(doc3 =>{
                          if(doc3.data()['id']==doc2.data()['uti_tra_idUti']){

                            this.utilisateur = doc3.data()
                            this.afSG.ref('users/'+doc3.data()['photo']).getDownloadURL().subscribe(imgUrl => {
                              this.utilisateur['photo'] = imgUrl;
                            })

                            this.firestore.collection("avis").get().toPromise().then((snapshot4)=>{
                              snapshot4.docs.forEach(doc4=>{
                                if(doc4.data()['destinataire']==doc3.data()['id']){
                                  this.nbAvis+=1;
                                  this.avisValue+=doc4.data()['note'];
                                  this.avisTotal = (this.avisValue / this.nbAvis)
                                  //console.log(this.avisTotal.toString().indexOf('.'))
                                  if(this.avisTotal.toString().indexOf('.') != -1){
                                    this.avisTotal=this.avisTotal.toFixed(2);
                                  }
                                }
                              })
                            })

                          }
                        })
                      })
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

  reserver(){
    this.firestore.collection('utilisateur_trajet').add({
      uti_tra_idTra: this.trajet['tra_id'],
      uti_tra_idUti: this.userid,
      uti_tra_role:"Passager",
    })
    this.router.navigateByUrl('/tabs/tableaubord');
  }

}
