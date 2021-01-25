import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import {AngularFirestore} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/storage';


@Component({
  selector: 'app-noter',
  templateUrl: './noter.page.html',
  styleUrls: ['./noter.page.scss'],
})
export class NoterPage {

  connected= true;
  public userId;
  public destId;

  utilisateurs: Observable<any[]>;
  utilisateur: Observable<any[]>;
  public images = "";


  public value = 0;
  public commentaire = "";


  constructor(
    public afAuth: AngularFireAuth,
    public afDB: AngularFireDatabase,
    public firestore: AngularFirestore,
    private router: Router,
    public afSG: AngularFireStorage,
    public toastController: ToastController
  ) {

    this.utilisateurs = this.firestore.collection('utilisateurs').valueChanges();
    this.getUtilisateur();

    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        this.router.navigateByUrl('/connexion');
        this.connected = false;
      } else {
        this.userId = auth.uid;
        this.connected = true;
        this.destId = this.router.url.slice(-28);
      }
   })
  }


  getUtilisateur(){
    var that = this;
    this.utilisateurs.subscribe(uti =>{
      uti.forEach(value => {
        if(value['id']==that.destId){
          that.utilisateur = value;
          console.log(value)
          that.getImagesStorage(value['photo'])
        }
      })
    });
    
  }

  getImagesStorage(image: any) {
    console.log(image)
    this.afSG.ref('users/'+image).getDownloadURL().subscribe(imgUrl => {
      console.log(imgUrl);
      this.images= imgUrl;
    });
    console.log("liste images :")
    console.log(this.images)
  }

  rating(value){
    this.value=value;
  }

  async errorValue(messages) {
    const toast = await this.toastController.create({
      message: messages,
      duration: 2000,
      animated: true,
      position: 'bottom',
    });
    await toast.present();
  }

  envoyer(){
    if(this.commentaire !=''){
      if(this.value !=0){
        
        this.firestore.collection('avis').add({
          utilisateur: this.userId,
          destinataire: this.destId,
          date: new Date().getTime(),
          note: this.value,
          commentaire: this.commentaire,
        });
        this.commentaire="";
        this.value=0;
        this.router.navigateByUrl('/tabs/tableaubord');

      }else{
        this.errorValue("N'hésite pas à donner une note quand même ;)")
      }
    }else{
      this.errorValue("Laisse un petit mot ;) ")
    }
  }

}
