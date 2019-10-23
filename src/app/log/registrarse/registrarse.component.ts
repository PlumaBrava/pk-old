import { Component, OnInit,ElementRef, ViewChild ,AfterViewInit} from '@angular/core';
import { AuthService } from '../../services/firebase/auth.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ModalMensajeComponent }  from '../../services/modal-mensaje/modal-mensaje.component';
import { NgbActiveModal, NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from "@angular/router"
@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.component.html',
  styleUrls: ['./registrarse.component.css']
})
export class RegistrarseComponent implements OnInit ,AfterViewInit {
  @ViewChild('confirmaClave',{static: true}) myconfirmaClave: ElementRef;
  mail:String=null;
  confirmaMail:String=null;
  clave:String=null;
  confirmaClave:String=null;


crearLabelForm = this.fb.group({
  email: ['', Validators.required],
  confirmaEmail: ['', Validators.required],
  clave: ['', Validators.required],
  confirmaClave: ['', Validators.required],
});
  constructor(  private fb: FormBuilder,
                public authService:AuthService,
                private _modal: NgbModal,
                private router:Router,
                //private el: ElementRef
                ) { }

  ngOnInit() {
  }
 ngAfterViewInit(): void {
        // outputs `I am span`
        // console.log(this.myconfirmaClave.nativeElement.textContent);
    }

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



 signUpold() {
     console.log('signup')
     console.log('signup email',this.crearLabelForm.value.email)
     console.log('signup clave',this.crearLabelForm.value.clave)

    this.authService.emailSignUp(String(this.crearLabelForm.value.email),String(this.crearLabelForm.value.clave));
  }



  loginGoogle() {
    this.authService.googleLogin();

  };

  signUp() {

    if(String(this.crearLabelForm.value.email)){
      if(this.crearLabelForm.value.clave!=this.crearLabelForm.value.confirmaClave){
        console.log("Claves Diferentes",this.crearLabelForm.value.clave);
        console.log("Claves Diferentes",this.crearLabelForm.value.confirmaClave);
        this.mostrarMensajeModal("Error! ","verifique!","Las claves ingresadas son distintas");
        return ;
      }
    this.authService.emailSignUp(String(this.crearLabelForm.value.email),String(this.crearLabelForm.value.clave)).subscribe(
        (envioOk) => {
         console.log(envioOk);
       }
      ,(error) =>{

           console.log(error);

         switch (error.code) {
// {code: "auth/email-already-in-use", message: "Thrown if there already exists an account with the given email address."}
// {code: "auth/invalid-email", message: "Thrown if the email address is not valid."}
// {code: "auth/operation-not-allowed", message: "Thrown if email/password accounts are not enabled. Enable email/password accounts in the Firebase Console, under the Auth tab."}
// {code: "auth/weak-password", message: "Password should be at least 6 characters Thrown if the password is not strong enough."}


             case "auth/wrong-password":
               error.message="La clave es invalida o el usuario no tiene una clave";
               break;

             case "auth/user-not-found":
               error.message="No se tiene registro de este usuario.";
               break;
             case "auth/network-request-failed":
               error.message="Error de red.";
               break;
             case "auth/too-many-requests":
               error.message="Muchos intentos con datos incorrectos. Intente nuevamente mas tarde";
               break;


             case "auth/email-already-in-use":
               error.message="Este email ya está en uso";
               break;
             case "auth/invalid-email":
               error.message="El email es invalido";
               break;
             case "auth/operation-not-allowed":
               error.message="Operacion no permitida"
               break;
             case "auth/weak-password":
               error.message="La clave es débil debe teren más de 6 caracteres"
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

loginMail(){
  this.router.navigate(['/logMail']);

}

onKeydown(event) {
  console.log(event);
  // console.log(this.crearLabelForm);
  // console.log(this.crearLabelForm);
  // console.log(this.crearLabelForm.controls['confirmaClave']);
  // // console.log(this.crearLabelForm.controls['confirmaClave'].nativeElement);
  // // this.crearLabelForm.get('confirmaClave').focus();
  // console.log(this.el);
  // console.log(this.el.nativeElement);
  // console.log(this.el.nativeElement.querySelectorAll('confirmaClave'));
  // console.log( this.myconfirmaClave);
  // this.myconfirmaClave.nativeElement.focus(); 

}

}
