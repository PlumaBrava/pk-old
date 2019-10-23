import { Component, OnInit,  Input} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-mensaje',
  templateUrl: './modal-mensaje.component.html',
  styleUrls: ['./modal-mensaje.component.css']
})
export class ModalMensajeComponent implements OnInit {
 @Input() name;
 @Input() titulo;
 @Input() mensaje;
 @Input() dato;

     model;
constructor(public modal: NgbActiveModal) {


}
  ngOnInit() {
      console.log(this.name);
      console.log(this.titulo);
      console.log(this.mensaje);
      console.log(this.dato);

  }

//   mostrarMensajeModal(titulo, mensaje, dato){
//  console.log(titulo);
//  console.log(mensaje);
//  console.log(dato);
//  const modalRef =    this._modal.open(ModalMensajeComponent);
//     modalRef.componentInstance.titulo = titulo;
//     modalRef.componentInstance.mensaje = mensaje;
//     modalRef.componentInstance.dato = dato;
//     modalRef.result.then(result=>{
//             console.log("result: "+result);
//             console.log("result.cause: "+result.cause);
//             console.log("result.date: "+result.date.year);
//             console.log("result.date: "+result.date.month);
//             console.log("result.date: "+result.date.day);
//           },reason=>{
//             console.log("rison: "+reason);
//              if (reason === ModalDismissReasons.ESC) {
//             return 'by pressing ESC';
//           } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
//             return 'by clicking on a backdrop';
//           } else {
//             return  `with: ${reason}`;
//           }
//           } );

// }

}
