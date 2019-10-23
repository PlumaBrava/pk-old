// referencia
// https://gist.github.com/codediodeio/5e02b605f2ab015f2fb1e60497bd46bf

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router,ActivatedRoute } from "@angular/router";
import * as firebase from 'firebase';

import { Observable, of , Observer} from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument ,AngularFirestoreCollection } from '@angular/fire/firestore';
import { MensajesService }  from '../../services/mensajes/mensajes.service';

@Injectable({
  providedIn: 'root'
}) 
export class AuthService {
  authState: any = null;
  PerfildeUsuario: any = null;




  constructor(private afAuth: AngularFireAuth,
              private  fs: AngularFirestore,
              private mensageService:MensajesService,
              private router:Router,
              private route: ActivatedRoute) {

                  console.log('authService start');
                  this.afAuth.authState.subscribe((auth) => {
                  // this.authState = auth
                  console.log('auth service', auth);
                  this.updateUserData(auth);
                  });
  }

   private updateUserData(auth): void {
     console.log('updateUserData auth',auth);
    if (auth!=null){
       // this.authState = auth
      // Writes user name and email to realtime db
      // useful if your app displays information about users or for admin features
      console.log('updateUserData',this.authState);

      let data = {
                  email: auth.email,
                  name: auth.displayName
                }
 //     var cleanEmail = auth.email.replace(/\./g, ',');
 
      this.authState = auth;
      this.getPefil(auth).subscribe(usuarioLogistica=>{
        console.log("perfil",usuarioLogistica);
        this.PerfildeUsuario=usuarioLogistica;
        this.mensageService.setPerfilUsuarioObs(usuarioLogistica);
        // this.authState = auth;
        this.seleccionPaginaInicio(usuarioLogistica);
      });
    }else {
      console.log("auth",auth);
      this.router.navigate(['/logMail']);
    }
  }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.authState !== null;
  }

  // Returns current user data
  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  // Returns
  get currentUserObservable(): any {
    return this.afAuth.authState
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  // Anonymous User
  get currentUserAnonymous(): boolean {
    return this.authenticated ? this.authState.isAnonymous : false
  }

  // Returns current user display name or Guest
  get currentUserDisplayName(): string {
    if (!this.authState) { return 'Guest' }
    else if (this.currentUserAnonymous) { return 'Anonymous' }
    else if (this.authState['displayName']==null) { return this.authState['email'] }
    else { return this.authState['displayName'] || 'User without a Name' }
  }

// Returns current user display name or Guest
  get currentUserPhotoURL(): string {
    return this.authState['photoURL'] ? this.authState['photoURL'] : false

  }

  //// Social Auth ////

  githubLogin() {
    const provider = new firebase.auth.GithubAuthProvider()
    return this.socialSignIn(provider);
  }

  googleLogin() {
      console.log('authService googleLogin');
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.socialSignIn(provider);
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider()
    return this.socialSignIn(provider);
  }

  twitterLogin(){
    const provider = new firebase.auth.TwitterAuthProvider()
    return this.socialSignIn(provider);
  }

  private socialSignIn(provider) {
     console.log('authService socialSignIn');
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) =>  {
            console.log('authService signInWithPopup',credential);
          // this.authState = credential.user
          this.updateUserData(credential.user);
           // this.router.navigate(['/'])
      })
      .catch(error => console.log(error));
  }


  //// Anonymous Auth ////

  anonymousLogin() {
    return this.afAuth.auth.signInAnonymously()
    .then((user) => {
      // this.authState = user
      this.updateUserData(user);
       this.router.navigate(['/'])
    })
    .catch(error => console.log(error));
  }

  //// Email/Password Auth ////

  emailSignUp(email:string, password:string) : Observable<any> {
     return new Observable((observer) => {

   this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        console.log(user);
        // this.authState = user
        this.updateUserData(user);

          // this.router.navigate(['/']);
           observer.next(user);
          observer.complete();// Para cerrar la susripcion.
      })
      .catch(error =>{
        observer.error(error);
        observer.complete();// Para cerrar la susripcion.
// {code: "auth/email-already-in-use", message: "Thrown if there already exists an account with the given email address."}
// {code: "auth/invalid-email", message: "Thrown if the email address is not valid."}
// {code: "auth/operation-not-allowed", message: "Thrown if email/password accounts are not enabled. Enable email/password accounts in the Firebase Console, under the Auth tab."}
// {code: "auth/weak-password", message: "Password should be at least 6 characters Thrown if the password is not strong enough."}
        } )
      });

  };


  emailLogin(email:string, password:string): Observable<any> {
     return new Observable((observer) => {

      this.afAuth.auth.signInWithEmailAndPassword(email, password)
       .then((user) => {
         console.log(user);
         // this.authState = user.user
         this.updateUserData(user.user)

          // this.router.navigate(['/']);
           observer.next(user);
          observer.complete();// Para cerrar la susripcion.
       })
       .catch(error =>{ console.log(error);
           observer.error(error);
          observer.complete();// Para cerrar la susripcion.
// code: "auth/wrong-password"
// message: "The password is invalid or the user does not have a password."

// code: "auth/user-not-found"
// message: "There is no user record corresponding to this identifier. The user may have been deleted."

// code: "auth/network-request-failed"
// message: "A network error (such as timeout, interrupted connection or unreachable host) has occurred."

// code: "auth/too-many-requests"
// message: "Too many unsuccessful login attempts.  Please include reCaptcha verification or try again later"

        } );
  })    ;
  }

  // Sends email allowing user to reset password
  resetPassword(email: string): Observable<any>{

    return new Observable((observer) => {

     var auth = firebase.auth();


     auth.sendPasswordResetEmail(email)
      .then(() => {console.log();
         observer.next("email sent");
         observer.complete();// Para cerrar la susripcion.)
        })
      .catch((error) => {
          console.log(error);
          observer.error(error);
          observer.complete();// Para cerrar la susripcion.
        });
    });
  };


  //// Sign Out ////

  signOut(): void {
    console.log('authService signOut');
    this.afAuth.auth.signOut();
    this.PerfildeUsuario=null;
    this.mensageService.setPerfilUsuarioObs(null);
    this.authState=null;
    this.router.navigate(['/'])

  }


  //// Helpers ////



// Determina si un usuario tieme perfil Administrador
  get esAdministrador(): boolean {
    return this.PerfildeUsuario!=null && this.PerfildeUsuario.data.perfil=='administrador'? true : false;
  }

// Determina si un usuario tieme perfil Cliente
  get esCliente(): boolean {
    return this.PerfildeUsuario!=null && this.PerfildeUsuario.data.perfil=='cliente'? true : false;
  }

  // Determina si un usuario tieme perfil Distribuidor
  get esDistribuidor(): boolean {
    return this.PerfildeUsuario!=null && this.PerfildeUsuario.data.perfil=='distribuidor'? true : false;
  }

    // Determina si un usuario tieme perfil tranportista
  get esTransportista(): boolean {
     return this.PerfildeUsuario!=null && this.PerfildeUsuario.data.perfil=='transportista'? true : false;
  }

  // Determina si un usuario tieme perfil Gestor de Pedidos
  get esGestorPedidos(): boolean {
     return this.PerfildeUsuario!=null && this.PerfildeUsuario.data.perfil=='gestorPedidos'? true : false;
  }

  get estaPendiente(): boolean {
    return this.PerfildeUsuario!=null && this.PerfildeUsuario.data.estado=='pendiente'? true : false;
  }

  get estaActivo(): boolean {
    return this.PerfildeUsuario!=null && this.PerfildeUsuario.data.estado=='activo'? true : false;
  }

  get estaSuspendido(): boolean {
    return this.PerfildeUsuario!=null && this.PerfildeUsuario.data.estado=='suspendido'? true : false;
  }

 get getPerfilUsuario(): any {
    return this.PerfildeUsuario;
  }

// Get perfil retorna un observable para que se pueda subscribir
// hace la consulta del Usuario
// cuando recibe la informacion la publica para que el suscriptor la pueda ver

getPefil(auth): Observable<any> {
  console.log('getUser');
  return new Observable((observer) => {

    this.fs.collection('Users',ref => ref.where('email', '==' ,auth.email))
    .snapshotChanges()
    // .valueChanges()
    .subscribe(datosDeUsuario=>{
    console.log(datosDeUsuario);
    if(datosDeUsuario.length>0){
      console.log('getPefil  collection data',datosDeUsuario[0].payload.doc.data());
      console.log('getPefil  collection key',datosDeUsuario[0].payload.doc.id);
      var usuarioLogistica= {'key':datosDeUsuario[0].payload.doc.id,'data':datosDeUsuario[0].payload.doc.data()}
      console.log('getPefil perf  keys',usuarioLogistica);
      observer.next(usuarioLogistica);
      observer.complete();// Para cerrar la susripcion.
    } else {
       console.log("ususario loguedo, pero sin autorizar por Nutralmix");
       console.log(datosDeUsuario);
       this.router.navigate(['/solicitudEmpresa']);
     }   
     }, err => {
  console.log(`Encountered error: ${err}`);
});
  });
}

  seleccionPaginaInicio(usuarioLogistica){
    console.log("seleccionPaginaInicio",usuarioLogistica.data.perfil);
    console.log( 'remi',    this.route.snapshot);
    console.log( 'remi url',    this.route.snapshot.children[0].url[0]);
    console.log( 'remi url',    this.route.snapshot.children[0].url[0].path);
     
    if(this.route.snapshot.children[0].url[0].path=="remitosDetallesId") {
      return;
    }

    if(usuarioLogistica.data.perfil!=null){
      console.log("seleccionPaginaInicio",'ingresa al if');

      switch (usuarioLogistica.data.perfil) {
          case "administrador":
           console.log("seleccionPaginaInicio administrador",'usuariosList');
          this.router.navigate(['/usuariosList']);
          break;
        case "gestorPedidos":
        this.router.navigate(['/pedidosCrearListados']);
          break;
        case "cliente":
        console.log("seleccionPaginaInicio cliente",'pedidos');
        this.router.navigate(['/pedidos']);
          break;
        case "distribuidor":
        this.router.navigate(['/pedidos']);
          break;
        case "transportista":
        this.router.navigate(['/remitosTransportista']);
          break;

        default:
        console.log("seleccionPaginaInicio default",'LogMail');
        this.router.navigate(['/LogMail']);
          break;
      }
    }

  }


}
