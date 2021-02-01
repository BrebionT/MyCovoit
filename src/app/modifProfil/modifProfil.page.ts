import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable, zip} from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-modifProfil',
  templateUrl: 'modifProfil.page.html',
  styleUrls: ['modifProfil.page.scss']
})



export class ModifProfilPage {
  public user = {
    nom: '',
    prenom: '',
    date_naiss: '',
    adresse: '',
    ville: '',
    cp: '',
    sexe: '',
    tel: '',
    bio: '',
    photo: '',
  };

  image = '';
  imagePath:string;
  upload: any;

  public images = "";
  utilisateurs: Observable<any[]>;
  public userid;
  public useriddata;
  public connected: boolean = false;
  utilisateur: Observable<any[]>;

  public disabled;

  minDate: String;
  maxDate: String;

  
  ville;
  liste_ville;

  cp;
  liste_cp;

  showville=false;
  showvillebycp=false;

  constructor(public firestore: AngularFirestore,
    public afAuth: AngularFireAuth,
    public afDB: AngularFireDatabase,
    private camera: Camera,
    private router: Router,
    public afSG: AngularFireStorage
    ) { 
    this.connecter();
    this.maxDate= this.formatDate(new Date(new Date().setDate(new Date().getDate() - 4745)).toISOString());
    this.minDate= this.formatDate(new Date(new Date().setDate(new Date().getDate() - 23725)).toISOString());
    
    this.utilisateurs = this.firestore.collection('utilisateurs').valueChanges();
    this.getUtilisateur();
    this.ville="";
    this.liste_ville=[{nom:''}]
    this.cp="";
    this.liste_cp=[{nom:''}]
  }

  connecter(){
    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        this.userid = auth.uid;
        this.getUserData();
        
        //console.log(this.userid);
      }
    });
  }

  ngOnInit() {
  }

  async addPhoto(source: string) {
    if (source === 'camera') {
      //console.log('camera');
      //const cameraPhoto = await this.openCamera();
      //this.image = 'data:image/jpg;base64,' + cameraPhoto;
    } else {
      //console.log('library');
      const libraryImage = await this.openLibrary();
      this.image = 'data:image/jpg;base64,' + libraryImage;
      this.uploadFirebase(this.image);
    }
  }
  async uploadFirebase(image) {
    const newPath = new Date().getTime() + '.jpg';
    this.imagePath = 'users/'+ newPath;
    //this.image = this.imagePath;
    //console.log('split : ',this.image.split(',')[1])
    this.upload = this.afSG.ref(this.imagePath).putString(image, 'data_url');
    
    this.upload.then(async () => {
    //this.image = this.images;
    //this.imagePath = this.images;
    this.user.photo = newPath;
    this.modifier();
    });
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

  

  getUserData(){
    var that = this;
    this.firestore.collection("utilisateurs").get().toPromise().then((snapshot)=>{
      snapshot.docs.forEach(doc =>{
        if(doc.data()['id']==that.userid){
          this.useriddata = doc.id;
          this.user = {
            nom: doc.data()['nom'],
            prenom: doc.data()['prenom'],
            date_naiss: doc.data()['date_naiss'],
            adresse: doc.data()['adresse'],
            ville: doc.data()['ville'],
            cp: doc.data()['cp'],
            sexe: doc.data()['sexe'],
            tel: doc.data()['tel'],
            bio: doc.data()['bio'],
            photo: doc.data()['photo']
          };
        }
      })
    })
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

  modifier(){
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

                  // traitement telephone

                  this.user.tel=this.user.tel.trim();
                  if(this.user.tel.length == 10){
                    if(this.parcoursString(this.user.tel)){
                      this.firestore.collection("utilisateurs").doc(this.useriddata).update({
                        nom: this.user.nom,
                        prenom: this.user.prenom,
                        date_naiss: this.user.date_naiss,
                        adresse: this.user.adresse,
                        ville: this.user.ville,
                        cp: this.user.cp,
                        sexe: this.user.sexe,
                        tel: this.user.tel,
                        bio: this.user.bio,
                        photo:this.user.photo
                      })
                      this.router.navigateByUrl('/tabs/profil');
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
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

  getUtilisateur(){
    var that = this;
    this.utilisateurs.subscribe(uti =>{
      uti.forEach(value => {
        if(value['id']==that.userid){
          that.utilisateur = value;
          //console.log(value)
          that.getImagesStorage(value['photo'])
          this.ville=value['ville']
          this.cp=value['cp']
        }
      })
    });
    
  }

  getImagesStorage(image: any) {
    //console.log(image)
    this.afSG.ref('users/'+image).getDownloadURL().subscribe(imgUrl => {
      //console.log(imgUrl);
      this.image= imgUrl;
      this.images= imgUrl;
    });
    //console.log("liste images :")
    //console.log(this.image)
  }
 
  returnConnected(){
    return this.connected;
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
    if(this.disabled==false){
      this.showville=val;
    }
    
  }

  showVilleByCP(val){
    if(this.disabled==false){
      this.showvillebycp=val;
    }
    
  }

  getVille(){
      if(this.ville.trim()==""){
        this.ville="";
      }
      const apiUrl2 = 'https://geo.api.gouv.fr/communes?nom='
      const format = '&format=json';
      
      let ville = this.ville;
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
  isDisabled(){
    if(this.user.ville!=""){
      return true;
    }else{
      return false;
    }
  }
  

}
