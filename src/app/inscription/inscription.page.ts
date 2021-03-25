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
  

dataUser = { // Objet comportant les informations de l'utilisateur
  email: '',
  password: '',
  password2: '',
  code:''
};

passwordType: string = 'password'; // Variable du type du champ pour le mot de passe ( visible ou non)
passwordIcon: string = 'eye-off'; // Nom de l'icon pour l'affichage du mot de passe

  constructor(
    private router: Router,
    public toastController: ToastController,
    public afAuth: AngularFireAuth,
    public afDB: AngularFireDatabase,
    public firestore: AngularFirestore
  ) {

}

  async errorMail(messages) { //Fonction qui affiche un message
    const toast = await this.toastController.create({
      message: messages,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  hideShowPassword() { //Fonction qui change le type du champ mot de passe et donc l'affichage des caractères et change l'icone
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
}
  
  signUp() { // Fonction de connexion
    if(this.dataUser.password == this.dataUser.password2){ // Les deux champs du mot de passe sont identiques
      if(this.dataUser.email!="" && this.dataUser.password!=""){ // Ils ne sont pas vides
        let chiffre = /\d/.test(this.dataUser.password); // Est-ce qu'il contient un chiffre ?
        let majuscule = /[A-Z]/.test(this.dataUser.password); // Est-ce qu'il contient une majuscule ?
        let minuscule = /[a-z]/.test(this.dataUser.password); // Est-ce qu'il contient une minuscule ?
        const valide = chiffre && majuscule && minuscule; // Soit 3 vrai sinon faux
        if (valide) {
          this.afAuth.createUserWithEmailAndPassword(this.dataUser.email, this.dataUser.password).then(auth =>{ //On crée un utilisateur avec un email et mot de passe
            this.afAuth.signInWithEmailAndPassword(this.dataUser.email, this.dataUser.password) //On se connecte
            .then(auth => {
              this.dataUser = {
                email: '',
                password: '',
                password2: '',
                code:''
              };
              this.router.navigateByUrl('/infos-perso'); // On se dirige vers infos-perso
            });
            
          })
          .catch(err => {
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

