import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import {FiredatabaseService} from '../../../services/firebase/firedatabase.service';
import { User } from '../user';
import { MensajesService }  from '../../../services/mensajes/mensajes.service';
// import {SqlserviceService} from '../../../services/sql/sqlservice.service';
// import { AutorizacionesService }  from '../../../services/autorizaciones/autorizaciones.service';
import { ModalMensajeComponent }  from '../../../services/modal-mensaje/modal-mensaje.component';
import { AuthService } from '../../../services/firebase/auth.service';
import { NgbActiveModal, NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
// import { AngularFireMessaging } from '@angular/fire/messaging';
import * as firebase from 'firebase';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-solicitu-empresa',
  templateUrl: './solicitu-empresa.component.html',
  styleUrls: ['./solicitu-empresa.component.css']
})
export class SolicituEmpresaComponent implements OnInit {
    solicitud = this.fb.group({
  razonSocial: ['', Validators.required],
  cuit: ['', Validators.required],
  comentario: ['', Validators.required],

});
    componenteHabilitado=false;
    mensaje='';
    uid:string=null;
    email:string=null;
    botonActivo:boolean=true;
  constructor(private fb: FormBuilder,
              private db: FiredatabaseService,
              public authService:AuthService,
                private _modal: NgbModal,
              private mensageService:MensajesService,
              private cd: ChangeDetectorRef,
                // public sql:SqlserviceService,
              // private autorizaciones:AutorizacionesService,
              ) { }

  ngOnInit() {
  	console.log("SolicituEmpresaComponent  start",);
  	console.log("UID",this.authService.currentUserId);
  	this.componenteHabilitado=true;
  
  	this.authService.currentUserObservable.subscribe(
  		data=>{console.log("UID 2",data);
  					
  					this.uid=data.uid;
  					this.email=data.email;
  					this.getSolicitud(this.uid);
  			}
    )

	this.db.getSolicitudesPorEstado('Pendiente').subscribe(
		data=>{console.log('getSolicitudesPendientes data', data);}
    	,error=>{console.log('getSolicitudesPendientes error', error);});
    
  };


  getSolicitud(uid){
  	const s=this.db.getSolicitud(uid).subscribe(
  		data=>{console.log(data);
  			if(data){
				let temp={ comentario: data.comentario,
				          cuit:  data.cuit,
				          estado: data.estado,
				          razonSocial: data.razonSocial    };
				          this.botonActivo=false;
				  this.solicitud.patchValue( temp);
          this.mensaje="Ya se enviaron los datos. Nutralmix está procesando su solicitud";
				  this.cd.detectChanges();
          this.botonActivo=false;
          this.mostrarMensajeModal('Su soliciud está en Proceso','Ya ha enviado su solicitud ', 'Nutralmix');
				  s.unsubscribe();
				}else{
					this.botonActivo=true;
			}  
  			
  		}
    	,error=>{console.log(error);}
    );
    
  }

  enviarSolicitud(): void {

  	if(this.validaciones()){

      this.db.postSolicitud(this.uid,this.email,this.solicitud.value.razonSocial,this.solicitud.value.cuit,this.solicitud.value.comentario)
        .subscribe(data=>{console.log(data);
	                      this.enviarMail();
                      }
             			,error=>{console.log(error);});
    }
	}
          
	validaciones():boolean{
        let resultado:boolean=true;
        console.log("SolicituEmpresaComponent  this.authService.currentUserId",this.authService.currentUserId);
        console.log("SolicituEmpresaComponent  this.solicitud.value.RazonSocial",this.solicitud.value.razonSocial);
        console.log("SolicituEmpresaComponent  this.solicitud.value.cuit",this.solicitud.value.cuit);
        console.log("SolicituEmpresaComponent  this.solicitud.value.comentario",this.solicitud.value.comentario);
		// if(!this.solicitud.value.RazonSocial){
		// 	resultado=true;
		// }else{
		// 	resultado=false;
		// }

		return resultado;

	}	
 
enviarMail(){
console.log('enviarMail');

// Reemplzar & por %26
// Reemplzar % por %25
// usar todas comillas simples

	let cuerpo:string=
"<TABLE style='max-width:600px; padding:5px; border:1 margin:0 auto; border-collapse: collapse;'><TR style=';'>"+
  "<TR>"+
   "<td style='  border:2px;'>"+
     "<div style='color:345050; text-align: justify; margin: 14%25 10%25 2%25'>"+
      "<h1 style='font-size: 20px margin: 0 0 7px'>Solicitud de Ususario</h1>"+
        "<p style='font-size: 15px; margin: 0'>"+
          "Llegó una nueva Solicitud de usario"+
         "</p>"+

        "<ul style='font-size: 25px; margin:10px 0'>"+
           "<li><b> Email: </b> <span style='font-size: 20px'> "+ this.email+"</span> </li>"+
           "<li><b> Razón Social: </b> <span style='font-size: 20px'> "+this.solicitud.value.razonSocial+"</span> </li>"+
           "<li><b> Cuit: </b> <span style='font-size: 20px'>"+this.solicitud.value.cuit+"</span> </li>"+
           "<li><b> Comentario: </b> </li>"+
           "<p style='font-size: 25px; margin: 0'>"+
              this.solicitud.value.comentario+
           "</p>"+
           
         "</ul>"+
      "</div>"+
  " </TD>"+
  "</TR>"+
  "<TR>"+
    "<td style='  border:2px;'>"+
       "<div style=' text-align: center; margin: auto'>"+
         "<a href='http://www.nutralmix.com.ar'>"+
            "<img src="+
            "'https://firebasestorage.googleapis.com/v0/b/nutraltest.appspot.com/o/pieMail.png?alt=media%26token=b4ea44d8-1f39-4b08-a527-7235d6a6cfcf'"
            +">"+
          "</a>"+
        "</div>"+
     "</TD>"+
  "</TR>"+
"</TABLE>"
;

  


   // this.sql.sendMail("perez.juan.jose@gmail.com ","Nueva Solicitud",cuerpo).subscribe(
   //   resp=>{console.log("resp",resp);},
   //   error=>{console.log("error",error);}
   //   );
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
            this.authService.signOut();
            
          } );
};

}



