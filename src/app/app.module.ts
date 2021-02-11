import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore/';
import { NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { Camera } from '@ionic-native/camera/ngx';

export const firebaseConfig ={
    /*apiKey: "AIzaSyCTtxeeIH-8FAMODW5YoTfHHaFtSuBy3wo",
    authDomain: "mycovoit-6e725.firebaseapp.com",
    projectId: "mycovoit-6e725",
    storageBucket: "mycovoit-6e725.appspot.com",
    messagingSenderId: "5697256208",
    appId: "1:5697256208:web:86ebf869169d70db280395"*/
    apiKey: "AIzaSyD1_DBlCDGqBOm4JAIYIWq7_v7smv_dh1k",
    authDomain: "mycovoit-314c0.firebaseapp.com",
    projectId: "mycovoit-314c0",
    storageBucket: "mycovoit-314c0.appspot.com",
    messagingSenderId: "392458809336",
    appId: "1:392458809336:web:79dea30a6d35dfb9fd300d",
    measurementId: "G-F7B78KG2X6"
};

/* export const firebaseConfig2 ={
  apiKey: "AIzaSyD1_DBlCDGqBOm4JAIYIWq7_v7smv_dh1k",
  authDomain: "mycovoit-314c0.firebaseapp.com",
  projectId: "mycovoit-314c0",
  storageBucket: "mycovoit-314c0.appspot.com",
  messagingSenderId: "392458809336",
  appId: "1:392458809336:web:79dea30a6d35dfb9fd300d",
  measurementId: "G-F7B78KG2X6"
}; */

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    //AngularFireModule.initializeApp(firebaseConfig2),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFirestoreModule
    
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  providers: [
    StatusBar,
    Camera,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}






