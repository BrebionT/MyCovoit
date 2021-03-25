import { Component, OnInit } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';

import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

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
    private router: Router,
    public alertController: AlertController
  ) { }

  ngOnInit() {

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
    //(this.email)
    if(this.email!="" && this.email != undefined){

      this.afAuth.sendPasswordResetEmail(this.email).then(
        async () => {
          const alert = await this.alertController.create({
            message: 'Un mail vous a été envoyé à l\'adresse : '+this.email,
            buttons: [
              {
                text: 'Ok',
                role: 'cancel',
                handler: () => {
                  this.router.navigateByUrl('/connexion');
                },
              },
            ],
          });
          await alert.present();
        },
        async error => {
          const errorAlert = await this.alertController.create({
            message: error.message,
            buttons: [{ text: 'Ok', role: 'cancel' }],
          });
          await errorAlert.present();
        }
      );
      
    }else{
      that.newMessage("Vous n'avez pas mis votre email.");
    }
    
    
  }

}
