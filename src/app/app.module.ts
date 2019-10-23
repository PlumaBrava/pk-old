import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// environmet
import { environment } from '../environments/environment';

// librerias de angular Fire
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';  //Firedatabase
import { AngularFirestoreModule   } from '@angular/fire/firestore/'; //Cloud Firestore
// import { AngularFireMessagingModule } from '@angular/fire/messaging'; //Messaging
// import { AngularFireStorageModule } from '@angular/fire/storage';

//// Servicios Internos
import { AuthService } from './services/firebase/auth.service';
import {MensajesService} from './services/mensajes/mensajes.service';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),  
    AngularFirestoreModule.enablePersistence(),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    // AngularFireStorageModule // imports firebase/storage only needed for storage features
  ],
  providers: [
  	AuthService, 
  	MensajesService
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
