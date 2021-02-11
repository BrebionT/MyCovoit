import { Component } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';

import { AngularFireDatabase } from '@angular/fire/database';

import {AngularFirestore} from '@angular/fire/firestore';

import { AngularFireAuth } from '@angular/fire/auth';

import { Router } from '@angular/router';

@Component({
  selector: 'app-inscription',
  templateUrl: 'inscription.page.html',
  styleUrls: ['inscription.page.scss']
})



export class InscriptionPage {
  

dataUser = {
  email: '',
  password: '',
  password2: '',
  code:''
};

passwordType: string = 'password';
passwordIcon: string = 'eye-off';

connected: boolean;


  constructor(
    private router: Router,
    public toastController: ToastController,
    public afAuth: AngularFireAuth,
    public afDB: AngularFireDatabase,
    public firestore: AngularFirestore
  ) {


    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        //console.log('non connecté');
        this.connected = false;
      } else {
        //console.log('connecté: ' + auth.uid);
        this.connected = true;
      }
    });

}

  async errorMail(messages) {
    const toast = await this.toastController.create({
      message: messages,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
}
  
  signUp() {
    if(this.dataUser.password == this.dataUser.password2){
      if(this.dataUser.email!="" && this.dataUser.password!=""){
        let chiffre = /\d/.test(this.dataUser.password);
        //console.log(chiffre);
        let majuscule = /[A-Z]/.test(this.dataUser.password);
        //console.log(majuscule);
        let minuscule = /[a-z]/.test(this.dataUser.password);
        //console.log(minuscule);
        const valide = chiffre && majuscule && minuscule;
        if (valide) {
          this.afAuth.createUserWithEmailAndPassword(this.dataUser.email, this.dataUser.password).then(auth =>{
            this.dataUser = {
              email: '',
              password: '',
              password2: '',
              code:''
            };
            this.afAuth.signInWithEmailAndPassword(this.dataUser.email, this.dataUser.password)
            .then(auth => {
              this.connected=true;
            });
            this.router.navigateByUrl('/infos-perso');
          })
          .catch(err => {
            //console.log(err.message);
            if(err.message.substring(0,27)=="Password should be at least"){
              this.errorMail("Le mot de passe doit contenir au moins 8 caractères");
            }
            else{
              this.errorMail("Mail déjà existant");
            }
            this.dataUser = {
              email: '',
              password: '',
              password2: '',
              code:''
            };
          });
      }else{
        this.errorMail("Il faut minimum une majuscule, une minuscule et un chiffre.");
        this.dataUser = {
          email: '',
          password: '',
          password2: '',
          code:''
        };
      }
        
      }else{
        this.errorMail("Un des champs est vide");
        this.dataUser = {
          email: '',
          password: '',
          password2: '',
          code:''
        };
      }
    }else{
      this.errorMail("Vous n'avez pas mis les même mot de passe.");
      this.dataUser = {
        email: '',
        password: '',
        password2: '',
        code:''
      };
    }    
    
  }
 
  Inscript(){
    this.router.navigateByUrl('/connexion');
  }
 

}

