import { Component } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';

import { AngularFireStorage } from '@angular/fire/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-infos-perso',
  templateUrl: './infos-perso.page.html',
  styleUrls: ['./infos-perso.page.scss'],
})
export class InfosPersoPage{

  trajets: Observable<any[]>;
  conducteur: string;
  heureArrive: string;
  heureDepart: string;
  passager: string;
  villeArrive: string;
  villedepart: string;
  minDate: String;
  maxDate: String;

  

  image = 'profil.png';
  imagePath: string;
  upload: any;

  

  //user: Observable<any[]>;
  public user = {
    nom: '',
    prenom: '',
    date_naiss: '',
    adresse: '',
    ville: '',
    cp: '',
    sexe: '',
    tel: '',
    classe: '',
    photo: '',
    id: '',
    bio: '',
    mail: ''
  };

  constructor(
    public loadingController: LoadingController,
    public alertController: AlertController,
    public afDB: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    public afSG: AngularFireStorage,
    public firestore: AngularFirestore,
    private router: Router,
    private camera: Camera,
    public toastController: ToastController
  ) {
    this.connecter();
    //this.user = this.firestore.collection('user').valueChanges();
    //this.trajets = this.firestore.collection('Trajets').valueChanges();
    this.maxDate= this.formatDate(new Date(new Date().setDate(new Date().getDate() - 4745)).toISOString());
    this.minDate= this.formatDate(new Date(new Date().setDate(new Date().getDate() - 23725)).toISOString());

    
    
    console.log(this.maxDate,this.minDate);
  }
  async addPhoto(source: string) {
    if (source === 'camera') {
      console.log('camera');
      const cameraPhoto = await this.openCamera();
      this.image = 'data:image/jpg;base64,' + cameraPhoto;
    } else {
      console.log('library');
      const libraryImage = await this.openLibrary();
      this.image = 'data:image/jpg;base64,' + libraryImage;
    }
  }

  async openCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1000,
      targetHeight: 1000,
      sourceType: this.camera.PictureSourceType.CAMERA
    };
    return await this.camera.getPicture(options);
  }

async openLibrary() {
  const options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    targetWidth: 1000,
    targetHeight: 1000,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
  };
  return await this.camera.getPicture(options);
}

async uploadFirebase() {
  this.imagePath = 'users/'+ new Date().getTime() + '.jpg';
  this.image = this.imagePath;
  this.upload = this.afSG.ref(this.imagePath).putString(this.image, 'data_url');
  
	this.upload.then(async () => {
  this.image = 'profil.png';
  this.imagePath = 'profil.png';
	});
}

  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
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

  connecter(){
    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        this.router.navigateByUrl('/connexion');
      } else {
        this.user.mail = auth.email;
        this.user.id = auth.uid;
        //console.log("email :"+auth.email);
        //console.log("uid :"+auth.uid);

      }
    });
  }

  envoyerUtilisateur(){
    
    if(this.user.nom!=''){
      if(this.user.prenom!=''){
        if(this.user.date_naiss!=''){
          if(this.user.ville!=''){
            if(this.user.adresse!=''){
              if(this.user.cp!=''){
                if(this.user.sexe!=''){
                  if(this.user.tel!=''){
                    //console.log(this.afDR.uid);
                    //this.afDB.list('users/').push({
                    this.firestore.collection('utilisateurs').add({
                      nom: this.user.nom,
                      prenom: this.user.prenom,
                      date_naiss: this.user.date_naiss,
                      adresse: this.user.adresse,
                      ville: this.user.ville,
                      cp: this.user.cp,
                      sexe: this.user.sexe,
                      tel: this.user.tel,
                      classe: this.user.classe,
                      photo: this.image,
                      id: this.user.id,
                      bio: this.user.bio,
                      mail: this.user.mail
                    });
                    this.uploadFirebase()
                    this.router.navigateByUrl('/tabs/tableaubord');
                  }else{
                    this.errorValue("Hey t'as pas un 06 ? ")
                  }
                }else{
                  this.errorValue("On ne te juge pas mais tu dois quand même mettre un genre.")
                }
              }else{
                this.errorValue("Si tu ne connais ton code postal on est mal 🤷‍♂️")
              }
            }else{
              this.errorValue("Un doute sur ton adresse ?")
            }
          }else{
            this.errorValue("Tu as honte de ta ville ? Tu dois l'indiquer'.")
          }
        }else{
          this.errorValue("Tu as un doute sur ton age c'est ça ?")
        }
      }else{
        this.errorValue("Bah... Vous n'avez pas de prénom ?")
      }
    }else{
      this.errorValue("Voyons... Il manque votre nom !")
    }
    
  }

  ionViewWillLeave(){
    if(this.user.nom=='' || this.user.prenom=='' || this.user.date_naiss=='' || this.user.ville=='' || this.user.adresse=='' || this.user.cp=='' || this.user.sexe=='' || this.user.tel==''){
      this.errorValue("Tu n'as pas inscrit tes données.")
      this.router.navigateByUrl('/tabs/infos-perso');
    }
  }

  
}
