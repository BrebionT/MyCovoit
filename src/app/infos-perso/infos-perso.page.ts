import { Component } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {bindCallback, Observable} from 'rxjs';
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

  public disabled=false;

  
  ville;
  liste_ville;

  cp;
  liste_cp;

  showville=false;
  showvillebycp=false;



  animal=true;
  cigarette=true;
  musique=true;
  parle=true;

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

    this.ville="";
    this.liste_ville=[{nom:''}]
    this.cp="";
    this.liste_cp=[{nom:''}]

    
    
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

  isCharNumber(c) {
    return c >= '0' && c <= '9';
  }

  parcoursString(ch){
    for(var i=0;i<ch.length;i++){
      if(!this.isCharNumber(ch[i])){
        return false
      }
    }
    return true;
  }

  envoyerUtilisateur(){
    
    if(this.user.nom.trim()!=""){
      if(this.user.prenom.trim()!=""){
        if(this.user.date_naiss.trim() >= this.minDate && this.user.date_naiss <= this.maxDate){
          if(this.user.ville.trim()!=""){
            if(this.user.adresse.trim()!=""){

              // traitement code postal

              this.user.cp=this.user.cp.trim();
              if(this.user.cp.length == 5){
                var reste = this.user.cp.substr(2,3)
                if(this.parcoursString(reste)){
                  if(this.user.adresse.trim()!=""){

                    // traitement telephone

                    this.user.tel=this.user.tel.trim();
                    if(this.user.tel.length == 10){
                      if(this.parcoursString(this.user.tel)){
                        
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
                          mail: this.user.mail,

                          animal:this.animal,
                          cigarette:this.cigarette,
                          musique:this.musique,
                          parle:this.parle
                          
                        });
                        this.uploadFirebase()
                        this.router.navigateByUrl('/tabs/tableaubord');
                      }else{
                        this.errorValue("Ce n'est pas un numéro ça ...")
                      }
                    }else{
                      this.errorValue("Ce n'est pas la longueur d'un numéro ça ...")
                    }
                  }else{
                    this.errorValue("On ne te juge pas mais tu dois quand même mettre un genre.")
                  }
                }else{
                  this.errorValue("Si tu ne connais ton code postal on est mal 🤷‍♂️")
                }
              }else{
                this.errorValue("Ce n'est pas la longueur d'un code postal ça ...")
              }
            }else{
              this.errorValue("Un doute sur ton adresse ?")
            }
          }else{
            this.errorValue("Tu as honte de ta ville ? Tu dois l'indiquer.")
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

  isDisabled(){
    if(this.user.ville!=""){
      return true;
    }else{
      return false;
    }
  }

  addVille(val){
    this.user.ville=val.nom;
    this.ville = val.nom;
    this.user.cp = val.codesPostaux[0];
    this.cp=val.codesPostaux[0];
    this.showville=false;
    this.showvillebycp=false;
    this.disabled=true;
  }

  addVilleByCP(val){
    this.user.ville=val.nom;
    this.ville = val.nom;
    this.user.cp = val.codesPostaux[0];
    this.cp=val.codesPostaux[0];
    this.showville=false;
    this.showvillebycp=false;
    this.disabled=true;
  }

  suppVille(){
    this.user.ville="";
    this.ville = "";
    this.user.cp="";
    this.cp="";
    this.disabled=false;
  }



  suppAdresse(){
    this.user.adresse="";
  }

  suppNom(){
    this.user.nom="";
  }

  suppPrenom(){
    this.user.prenom="";
  }

  showVille(val){
    console.log(val)
    if(this.disabled==false){
      this.showville=val;
    }
    
  }

  showVilleByCP(val){
    if(this.disabled==false){
      this.showvillebycp=val;
    }
    
  }

  getVille(event){
      if(this.ville.trim()==""){
        this.ville="";
      }
      const apiUrl2 = 'https://geo.api.gouv.fr/communes?nom='
      const format = '&format=json';
      
      let ville = event;
      //let ville = this.user.ville;
      let url2 = apiUrl2+ville+'&limit=3'+format;
  

        fetch(url2, {method: 'get'}).then(response => response.json()).then(results => {
          this.liste_ville=results
          console.log(results);
          
          
        }).catch(err => {
          this.liste_ville=[{nom:''}]
          console.log(err);
        });
  }

  getVilleByCP(){
    

    if(this.cp.trim()==""){
      this.cp="";
    }
    const apiUrl = 'https://geo.api.gouv.fr/communes?codePostal='
    const format = '&format=json';
    
    let cp = this.cp;
    //let ville = this.user.ville;
    let url2 = apiUrl+cp+format;


      fetch(url2, {method: 'get'}).then(response => response.json()).then(results => {
        this.liste_cp=results
        console.log(results);
        
        
      }).catch(err => {
        this.liste_cp=[{nom:''}]
        console.log(err);
      });
    
  }

  prefAnimal(){
    if(this.animal!=true){
      this.animal=true;
    }else{
      this.animal=false;
    }
  }
  prefCigarette(){
    if(this.cigarette!=true){
      this.cigarette=true;
    }else{
      this.cigarette=false;
    }
  }
  prefMusique(){
    if(this.musique!=true){
      this.musique=true;
    }else{
      this.musique=false;
    }
  }
  prefParle(){
    if(this.parle!=true){
      this.parle=true;
    }else{
      this.parle=false;
    }
  }
  
}
