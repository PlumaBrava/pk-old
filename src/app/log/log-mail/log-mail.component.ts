import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/firebase/auth.service';

import { ModalMensajeComponent }  from '../../services/modal-mensaje/modal-mensaje.component';
import { NgbActiveModal, NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from "@angular/router";

@Component({
  selector: 'app-log-mail',
  templateUrl: './log-mail.component.html',
  styleUrls: ['./log-mail.component.css']
})
export class LogMailComponent implements OnInit {

  constructor(private fb: FormBuilder,
              public authService:AuthService,
              private _modal: NgbModal,
              private router:Router
              ) { }
crearLabelForm = this.fb.group({
  email: ['', Validators.required],

  clave: ['', Validators.required],

});
  ngOnInit() {
  }
signIn() {
     console.log('signIn')
     console.log('signIn email',this.crearLabelForm.value.email)
     console.log('signIn clave',this.crearLabelForm.value.clave)



    this.authService.emailLogin(String(this.crearLabelForm.value.email),String(this.crearLabelForm.value.clave)).subscribe((user) => {
         console.log(user)
       },(error) =>{

           console.log(error);

         switch (error.code) {
             case "auth/wrong-password":
               error.message="La clave es invalida o el usuario no tiene una clave"
               break;

             case "auth/user-not-found":
               error.message="No se tiene registro de este usuario."
               break;
             case "auth/network-request-failed":
               error.message="Error de red."
               break;
             case "auth/too-many-requests":
               error.message="Muchos intentos con datos incorrectos. Intente nuevamente mas tarde"
               break;

             default:
                error.message="error de logg sin clasificar"
               break;
           }
// code: "auth/wrong-password"
// message: "The password is invalid or the user does not have a password."

// code: "auth/user-not-found"
// message: "There is no user record corresponding to this identifier. The user may have been deleted."

// code: "auth/network-request-failed"
// message: "A network error (such as timeout, interrupted connection or unreachable host) has occurred."

// code: "auth/too-many-requests"
// message: "Too many unsuccessful login attempts.  Please include reCaptcha verification or try again later"


      this.mostrarMensajeModal("Error al validar el usuario","verifique!",error.message);
         let temp={
          email: '',
          clave: '' };
      this.crearLabelForm.patchValue( temp);
      // this.crearLabelForm.value.email.setValue("nue");
    });

  };


mostrarMensajeModal(titulo, mensaje, dato){
 console.log(titulo);
 console.log(mensaje);
 const modalRef =    this._modal.open(ModalMensajeComponent);
    modalRef.componentInstance.titulo = titulo;
    modalRef.componentInstance.mensaje = mensaje;
    modalRef.componentInstance.dato = dato;
    modalRef.result.then(result=>{
            console.log("result: "+result);
            console.log("result.cause: "+result.cause);
            console.log("result.date: "+result.date.year);
            console.log("result.date: "+result.date.month);
            console.log("result.date: "+result.date.day);
          },reason=>{
            console.log("rison: "+reason);
             if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
          } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
          } else {
            return  `with: ${reason}`;
          }
          } );
};


  loginGoogle() {
    this.authService.googleLogin();

  };

  resetPassword() {

    if(String(this.crearLabelForm.value.email)){
    this.authService.resetPassword(String(this.crearLabelForm.value.email)).subscribe(
        (envioOk) => {
         console.log(envioOk);
         this.mostrarMensajeModal("Se ha enviado un Email","Se envió un correo electronico a la casilla "+ String(this.crearLabelForm.value.email)+" con un link para que ingrese una nueva clave",'');
         let temp={
          email: '',
          clave: '' };
      this.crearLabelForm.patchValue( temp);
       }
      ,(error) =>{

           console.log(error);

         switch (error.code) {
             case "auth/wrong-password":
               error.message="La clave es invalida o el usuario no tiene una clave"
               break;

             case "auth/user-not-found":
               error.message="No se tiene registro de este usuario."
               break;
             case "auth/network-request-failed":
               error.message="Error de red."
               break;
             case "auth/too-many-requests":
               error.message="Muchos intentos con datos incorrectos. Intente nuevamente mas tarde"
               break;

             default:
                error.message="error de logg sin clasificar"
               break;
           }
                 this.mostrarMensajeModal("Error al validar el usuario","verifique!",error.message);
         let temp={
          email: '',
          clave: '' };
      this.crearLabelForm.patchValue( temp);
// code: "auth/wrong-password"
// message: "The password is invalid or the user does not have a password."

// code: "auth/user-not-found"
// message: "There is no user record corresponding to this identifier. The user may have been deleted."

// code: "auth/network-request-failed"
// message: "A network error (such as timeout, interrupted connection or unreachable host) has occurred."

// code: "auth/too-many-requests"
// message: "Too many unsuccessful login attempts.  Please include reCaptcha verification or try again later";
    
    });
} else {

      console.log("Mail nulo");
       this.mostrarMensajeModal("Error! ","verifique!","El email no puede ser nulo");

    }
  };

registrarme(){
  this.router.navigate(['/registrarse']);

}

}
