import { Injectable } from '@angular/core';
import { Observable, throwError, of, Subject } from 'rxjs';


import { User } from '../../admin/users/user';


@Injectable({
  providedIn: 'root'
})

export class MensajesService {

  user: User = new User();
  private perfilUsuarioSeleccionado:any= null;
  private perfilUsuario = new Subject<any>();
   // private empresaSelected = new Subject<any>();
  private empresaSelected:any = null;
  private pedidoSelected:any = null;// se usa para navegar los pedidos Tango
  private pedidoWebSelected:any = null;// se usa para editar o procesar los pedidos web
  private alertaSelected:any = null;// se usa para editar o procesar los pedidos web
  constructor() { }

    setUserObs(user: User): Observable<User> {
      console.log(user);
       this.user=user;
       return of (this.user);
    }

    getUserObs(): Observable<User> {
       return of (this.user);
    }

    setPerfilUsuarioObs(perfilUsuario:any ) {
      console.log('mensaje perfil',perfilUsuario);
      this.perfilUsuarioSeleccionado=perfilUsuario;
      this.perfilUsuario.next(perfilUsuario);
       // return of (this.perfilUsuario);
    }

// responde varias veces al ser llamado desde un componete
// al iniciar un componente responde nulo porque no lo he grabado
     getPerfilUsuarioSeleccionadoObs(): Observable<any> {
           // return this.perfilUsuario.asObservable();
       return of (this.perfilUsuarioSeleccionado);
    }

// responde solo la primera vez con un valor no nulo
// cuando leo el perfil despues de tener el usuario logueado
    getPerfilUsuarioObs(): Observable<any> {
           return this.perfilUsuario.asObservable();

       // return of (this.perfilUsuario);
    }


    getPerfil():Observable<any>{
      if(this.perfilUsuarioSeleccionado){        // es nulo cuando no tengo el usuario porque no lo grabe
                                                // lo grabo para no tener que ir a consultar la base todas las veces.
        return of (this.perfilUsuarioSeleccionado);
      } else {
        return this.perfilUsuario.asObservable(); // se activa cuando resibe los datos al loguer el usuario.
      }

    }

    setEmpresaSelectedObs(empresaSelected:any ): Observable<any> {
      console.log(empresaSelected);

         this.empresaSelected=empresaSelected;
       return of (this.empresaSelected);

    }

    getEmpresaSelectedObs(): Observable<any>  {
      console.log("getEmpresaSelectedObs");
      // return this.empresaSelected.asObservable();
      return of (this.empresaSelected);
    }

  setPedidoSelectedObs(pedidoSelected:any ): Observable<any> {
      console.log(pedidoSelected);

         this.pedidoSelected=pedidoSelected;
       return of (this.pedidoSelected);

    }

    getPedidoSelectedObs(): Observable<any>  {
      console.log("getEmpresaSelectedObs");

      return of (this.pedidoSelected);
    }




    setPedidoWebSelectedObs(pedidoWebSelected:any ): Observable<any> {
      console.log(pedidoWebSelected);
         this.pedidoWebSelected=pedidoWebSelected;
       return of (this.pedidoWebSelected);

    }

    getPedidoWebSelectedObs(): Observable<any>  {
      console.log("getPedidoWebSelectedObs");
      // return this.empresaSelected.asObservable();
      return of (this.pedidoWebSelected);
    }


     setAlertaSelectedObs(alertaSelected:any ): Observable<any> {
      console.log('setAlertaSelectedObs', alertaSelected);
         this.alertaSelected=alertaSelected;
       return of (this.alertaSelected);

    }

    getAlertaSelectedObs(): Observable<any>  {
      console.log("getAlertaSelectedObs");
      // return this.empresaSelected.asObservable();
      return of (this.alertaSelected);
    }
}
