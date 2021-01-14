import { Component, OnInit } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';

import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-motdepasseoublie',
  templateUrl: './motdepasseoublie.page.html',
  styleUrls: ['./motdepasseoublie.page.scss'],
})
export class MotdepasseoubliePage implements OnInit {

  public email: string;

  constructor(
    public afAuth: AngularFireAuth,
    public toastController: ToastController,
  ) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.resetEmail();
      }})
  }
  async newMessage(messages){
    const toast = await this.toastController.create({
      message: messages,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
  

  resetEmail(){
    //console.log(typeof(this.email))
    var that = this;
    console.log(this.email)
    if(this.email!="" && this.email != undefined){
      this.afAuth.authState.subscribe(user => {
        if(this.afAuth.currentUser){
            this.afAuth.sendPasswordResetEmail(this.email).then(
              auth => {that.newMessage("Un mail vous a été envoyé.");}).catch(
              err => {that.newMessage("Vous n'avez pas de compte avec cette adresse.");});
            //that.newMessage("Un mail vous a été envoyé.");
        }else{
          console.log("test")
        }
      });
    }else{
      that.newMessage("Vous n'avez pas mis votre email.");
    }
    
    
  }

}
