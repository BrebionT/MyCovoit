import { Component } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {Observable} from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  utilisateurs: Observable<any[]>;
  public userid;
  navigate : any;
  constructor(
    public firestore: AngularFirestore,
    public afAuth: AngularFireAuth,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    
  ) {
    this.connecter();
    this.sideMenu();
    this.initializeApp();
    this.utilisateurs = this.firestore.collection('utilisateurs').valueChanges();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }


sideMenu()
  {
    this.navigate =
    [
      {
        title : "Modifier mon profil",
        url   : "/tabs/modifProfil",
        icon  : "create-outline"

      },
      {
        title : "Conditions générales",
        url   : "/tabs/conditionGen",
        icon  : "reader-outline"
      },
      {
        title : "Déconnexion",
        url   : "/tabs/deconnexion",
        icon  : "exit-outline"
      },
    ]
  }
  connecter(){
    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        this.userid = auth.uid;
        console.log(this.userid);
      }
    });
  }
}