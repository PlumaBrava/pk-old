import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';



// environmet
import { environment } from '../environments/environment';

// librerias de angular Fire
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';  //Firedatabase
import { AngularFirestoreModule   } from '@angular/fire/firestore/'; //Cloud Firestore
// import { AngularFireMessagingModule } from '@angular/fire/messaging'; //Messaging
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';







import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

//// Servicios Internos
import { AuthService } from './services/firebase/auth.service';
import { FiredatabaseService } from './services/firebase/firedatabase.service';
import {MensajesService} from './services/mensajes/mensajes.service';
import {ModalMensajeComponent} from './services/modal-mensaje/modal-mensaje.component';


// Componenetes propios
import { LogMailComponent } from '../app/log/log-mail/log-mail.component';
import { RegistrarseComponent } from '../app/log/registrarse/registrarse.component';
import { SolicituEmpresaComponent } from '../app/admin/users/solicitu-empresa/solicitu-empresa.component';

@NgModule({
  declarations: [
    AppComponent,
    LogMailComponent,
    RegistrarseComponent,
    SolicituEmpresaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
     FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),  
    AngularFirestoreModule.enablePersistence(),
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule
   


  ],
  providers: [
  	AuthService, 
  	MensajesService,
    FiredatabaseService,
    ModalMensajeComponent
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
