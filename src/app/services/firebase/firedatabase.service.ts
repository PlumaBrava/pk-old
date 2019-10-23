import { Injectable } from '@angular/core';
import { AngularFireDatabaseModule, AngularFireDatabase  } from '@angular/fire/database';
// import {  FirebaseListObservable } from '@angular/fire/database-deprecated';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from "@angular/router";
import * as firebase from 'firebase';
import { AuthService } from '../../services/firebase/auth.service';

import { AngularFirestore, AngularFirestoreDocument ,AngularFirestoreCollection } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
// import { User } from '../../admin/users/user';



@Injectable({
  providedIn: 'root'
})
export class FiredatabaseService {
// items: Observable<any[]>;
refUsersLogistica = firebase.firestore().collection('Users-Logistica');
refSolicitudes = firebase.firestore().collection('Users-Solicitudes');
refProductosPedidos = firebase.firestore().collection('Productos-Pedidos');
refPedidosWeb = firebase.firestore().collection('PedidosWeb');
refPedidosWebClientes = firebase.firestore().collection('PedidosWebClientes');
refAlertasReposicion = firebase.firestore().collection('Alertas-reposicion');
refEmpresasMail = firebase.firestore().collection('Empresas-Mails');
reffcmTokens = firebase.firestore().collection('fcmTokens');

  constructor(  private db: AngularFireDatabase,
              public authService:AuthService, 
              private  fs: AngularFirestore
   // private userCollection: AngularFirestoreCollection<User>


   ) {
// this.items = fs.collection('Users-Logistica').valueChanges();
// this.items.subscribe(data=>{console.log('fs',data);})

  }


 updateUserData(key:string,email:string,perfil:string,estado:string,infoTrak:number,listaEmpresas:any[],settings:any ): void {
  // Writes user name and email to realtime db
  // useful if your app displays information about users or for admin features
    console.log('updateUserData');
    console.log('updateUserData',this.authService.authState);
    console.log('updateUserData settings',settings);
    // const cleanEmail = this.authService.authState.email.replace(/\./g, ',');
    const cleanEmail = email.replace(/\./g, ',');
    const path = `users/${cleanEmail}`; // Endpoint on firebase
    console.log(path);

    // Se definen los valores default de settings
    let settingsData=     {aceptaDescargaSinRepresentante: false,
            aceptaNotificaciones: false,
            ventanaVisualizacionPedidos: 30};

    // Si existen datos de settings se usan esos valores, de lo contrario queda los valores default
    if(settings){ settingsData=settings;
      console.log('Entra en settings', settingsData);
      }
    if(!infoTrak){infoTrak=0;}  
   console.log('settings ', settingsData);
    let data:any;
              if(listaEmpresas==null){ // si la lista de empresas es nula no grabo el dato para que firebase no de error
                      data = {
                      operador: this.authService.authState.email,
                      email:email,
                      perfil: perfil,
                      userEmpresaPerfil: ' ',
                      estado:estado,
                      settings:settingsData,
                      fechaSolicitudDatatos:{seconds:0},
                      infoTrak:infoTrak,
                      timeStamp:this.timestamp()
                }
              } else{

                     data = {
                      operador: this.authService.authState.email,
                      email:email,
                      perfil: perfil,
                      empresas:listaEmpresas,
                      EmpresaSelected:listaEmpresas[0],
                      userEmpresaPerfil:listaEmpresas[0].RAZON_SOCI?listaEmpresas[0].RAZON_SOCI:' ',
                      estado:estado,
                      settings:settingsData,
                      fechaSolicitudDatatos:{seconds:0},
                      infoTrak:infoTrak,
                      timeStamp:this.timestamp()
                    }


                }

console.log("key",key);

        if(key){
console.log("update data",data);
          this.updateUser(key,data)
                .subscribe(res => {
                  // let id = res['key'];
                  console.log("res a",res);
                  }, (err) => {
                    console.log("res b",err);
                  console.log(err);
                    });
         if(data.empresas){         
          for (var i = 0; i < data.empresas.length; i++) {
                     this.updateEmpresaMail(data.empresas[i].COD_CLIENT,key,data.email).subscribe(
                         res=>{console.log(res);}
                         ,(err) => {console.log(err); });
                      
            }
         }      

        } else{
            console.log("new data",data);
            this.postUser(data)
                .subscribe(
                  res => {
                    let id = res['key'];
                    console.log(res);
                    console.log(data);
                    for (var i = 0; i < data.empresas.length; i++) {
                     this.updateEmpresaMail(data.empresas[i].COD_CLIENT,id,data.email).subscribe(
                         res=>{console.log(res);}
                         ,(err) => {console.log(err); });
                      
                    }
                    
                    }
                  ,(err) => {  console.log(err);
                });
       }

  }





/// Firebase Server Timestamp
get timestamp() {
  return firebase.firestore.FieldValue.serverTimestamp;

}


/// Crea un nuevo usuario. Es una funcionalidad del administrador
postUser(data): Observable<any> {
  return new Observable((observer) => {
    this.refUsersLogistica.add(data).then((doc) => {
      observer.next({
        key: doc.id,
      });
    });
  });
}

/// Actualiza los datos del ususario. Es una funcionalidad del administrador

updateUser(id: string, data): Observable<any> {
  return new Observable((observer) => {
    this.refUsersLogistica.doc(id).set(data).then(() => {
      observer.next();
    });
  });
}


/// Actualiza los datos del ususario. Es una funcionalidad del administrador

updateEmpresaMail(codClient: string, userKey:string,email:string): Observable<any> {
  return new Observable((observer) => {
    let data={};
    data[userKey]=email;
    if(email==null){     
      data[userKey]=firebase.firestore.FieldValue.delete();
      }
    this.refEmpresasMail.doc(codClient).set(data,{merge: true}).then(() => {
      observer.next();
    });
  });
}

/// Lista los usuarios de la aplicacion. Es una funcionalidad del administrador
getUsers(): Observable<any> {
  console.log('getUser');
  return new Observable((observer) => {
    this.refUsersLogistica.orderBy('email').limit(2).startAt('per').onSnapshot((querySnapshot) => {
       console.log('getUser querySnapshot',querySnapshot);
      let listaUsuarios = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        listaUsuarios.push({

          key: doc.id,
          email: data.email,
          empresas: data.empresas,
          estado: data.estado,
          infoTrak: data.infoTrak,
          operador: data.operador,
          perfil: data.perfil,
          settings:data.settings,
          fechaSolicitudDatatos:data.fechaSolicitudDatatos,
          userEmpresaPerfil:data.userEmpresaPerfil,
          timeStamp: data.timeStamp
        });
      });
       console.log('getUser',listaUsuarios);
      observer.next(listaUsuarios);
    });
  });
}

actualizarFechaDeSolicitudDatos(id){
  this.refUsersLogistica.doc(id).set({fechaSolicitudDatatos:this.timestamp()},{merge: true}).then((Response) => {
      console.log('updateUserSettings Response ',Response);
      // observer.next();
    }).catch((error)=>
    {console.log("updateUserSettings",error);}
    );
}


/// Lista los usuarios de la aplicacion. Es una funcionalidad del administrador, Clientes y distribuidor para
// configurar datos del comportamiento de la aplicacion
// Si quiere recibir mensajes, la cantidad de dias de antguedad que se retornan en pedidos y remitos.

updateUserSettings(id: string, data): Observable<any> {
// updateUserSettings(id: string, data): void {
  console.log('updateUserSettings');
  console.log('updateUserSettings id: ', id);
  console.log('updateUserSettings data',data );
  data['fechaSolicitudDatatos']=this.timestamp();
  return new Observable((observer) => {
    this.refUsersLogistica.doc(id).set(data).then((Response) => {
      console.log('updateUserSettings Response ',Response);
      observer.next(Response);
    }).catch((error)=>
    {console.log("updateUserSettings",error);
      observer.error(error);}
    );
  });
}




// Crea un nueva nueva solicitud. Cuando un usuario no tiene el email configurado por el administrador.
// Se usa como Id de documento la Uid del usuario.
postSolicitud(uid:string,email:string,razonSocial:string,cuit:string,comentario:string,): Observable<any> {
   let data:any;
    data = {email:email,
            razonSocial: razonSocial,
            cuit:cuit,
            comentario: comentario,
            estado:'Pendiente',
            timeStamp:this.timestamp()
           };
   console.log(data);
   console.log(uid);
  return new Observable((observer) => {
    this.refSolicitudes.doc(uid).set(data).then((doc) => {
      console.log(doc);
      observer.next(doc);
    }).catch( (error)=>{
      console.log(error);
      observer.error(error)
    });
  });
}

/// Lee la solicitud generada por el usuario
getSolicitud(uid): Observable<any> {
  console.log('getSolicitud');
  return new Observable((observer) => {
    this.refSolicitudes.doc(uid).onSnapshot((querySnapshot) => {
       console.log('getSolicitud querySnapshot',querySnapshot);
      let listaUsuarios = [];
      
       console.log('getSolicitud',querySnapshot.data());
      observer.next(querySnapshot.data());
    });
  });
}

// Lista de Solicitudes Pendientes
getSolicitudesPorEstado(estado:string): Observable<any> {
  console.log('getSolicitudesPendientes');
  return new Observable((observer) => {
    this.refSolicitudes.where('estado','==',estado).onSnapshot((querySnapshot) => {
       console.log('getSolicitudesPendientes querySnapshot',querySnapshot);
      let listaSolicitudes = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        listaSolicitudes.push({
          uid: doc.id,
          email: data.email,
          razonSocial:data. razonSocial,
          cuit:data.cuit,
          comentario:data.comentario,
          estado:data.estado,
          timeStamp:data.timeStamp
        });
      });
       console.log('getSolicitudesPendientes listaSolicitudes',listaSolicitudes);
      observer.next(listaSolicitudes);
    });
  });
}

// Lista de Solicitudes Pendientes
getSolicitudes(): Observable<any> {
  console.log('getSolicitudes');
  return new Observable((observer) => {
    this.refSolicitudes.onSnapshot((querySnapshot) => {
       console.log('getSolicitudes querySnapshot',querySnapshot);
      let listaSolicitudes = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        listaSolicitudes.push({
          uid: doc.id,
          email: data.email,
          razonSocial:data. razonSocial,
          cuit:data.cuit,
          comentario:data.comentario,
          estado:data.estado,
          timeStamp:data.timeStamp
        });
      });
       console.log('getSolicitudesPendientes listaSolicitudes',listaSolicitudes);
      observer.next(listaSolicitudes);
    });
  });
}


/// Actualiza una solicitud. Es una funcionalidad del administrador

updateSplicitud(id: string, data): Observable<any> {
  return new Observable((observer) => {
    this.refSolicitudes.doc(id).set(data).then(() => {
      observer.next();
    });
  });
}

updateUserEmpresaSelected(id: string, codEmpresa): void {
  console.log('updateUserSettings');
  console.log('updateUserSettings id: ', id);
  console.log('updateUserSettings codEmpresa',codEmpresa );
  // return new Observable((observer) => {


    this.refUsersLogistica.doc(id).set({EmpresaSelected: codEmpresa},{merge: true}).then((Response) => {
      console.log('updateUserSettings Response ',Response);
      // observer.next();
    }).catch((error)=>
    {console.log("updateUserSettings",error);}
    );
  // });
}

getUsersFilterMail(filtroMail): Observable<any> {
  console.log('getUsersFilterMail');
  return new Observable((observer) => {
    this.refUsersLogistica
    // orderBy('email').startAt(filtroMail).endAt(filtroMail+'\uf8ff').onSnapshot((querySnapshot) => {
    .orderBy('email')
    .startAt(filtroMail)
    .limit(25)
    // .endAt(filtroMail+'\uf8ff')
    .onSnapshot((querySnapshot) => {
      let listaUsuarios = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        listaUsuarios.push({

          key: doc.id,
          email: data.email,
          empresas: data.empresas,
          infoTrak:data.infoTrak,
          estado: data.estado,
          operador: data.operador,
          perfil: data.perfil,
          fechaSolicitudDatatos:data.fechaSolicitudDatatos,
          userEmpresaPerfil:data.userEmpresaPerfil,
          timeStamp: data.timeStamp
        });
      });
       console.log('getUsersFilterMail',listaUsuarios);
      observer.next(listaUsuarios);
    });
  });
}


getUsersFilterEmpresa(razonSocial): Observable<any> {
  console.log('getUsersFilterMail');
  return new Observable((observer) => {
    this.refUsersLogistica
    .orderBy('userEmpresaPerfil')
    .startAt(razonSocial)
    .limit(25)
    // .endAt(filtroMail+'\uf8ff')
    .onSnapshot((querySnapshot) => {
      console.log(querySnapshot);
      let listaUsuarios = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        listaUsuarios.push({

          key: doc.id,
          email: data.email,
          empresas: data.empresas,
          infoTrak:data.infoTrak,
          estado: data.estado,
          operador: data.operador,
          perfil: data.perfil,
          userEmpresaPerfil:data.userEmpresaPerfil,
          timeStamp: data.timeStamp
        });
      });
       console.log('getUsersFilterMail',listaUsuarios);
      observer.next(listaUsuarios);
    });
  });
}

validatUserMailExist(email): Observable<boolean>  {
  console.log('getUsersMailExist');
return new Observable((observer) => {
    this.refUsersLogistica.where('email','==',email).onSnapshot((querySnapshot) => {
console.log('validatUserMailExist querySnapshot.empty',querySnapshot.empty);
console.log('validatUserMailExist querySnapshot.size',querySnapshot.size);

      if(querySnapshot.empty){
         console.log('validatUserMailExist el ususario no existe');
        observer.next( false);  // el ususario no existe
      } else {
        console.log('validatUserMailExist el ususario  existe');
         observer.next( true);  // el ususario  existe
      }
    }, Error=>{
      console.log('validatUserMailExist Error',Error);
     observer.next( false);;
    });

});

  };



/// Almacena los productos que se reciben de los pedidos que pasaron por la aplicacion


// updateUserSettings(id: string, data): Observable<any> {
setProductos( codigoEmpresa: string, codigoProducto: string, descripcion:string, descripcionAdicional:string , unidadMedStock:string   ): void {
  console.log('setProductos');

  console.log('setProductos codigoEmpresa',codigoEmpresa );
  console.log('setProductos codigoProducot',codigoProducto );
  console.log('setProductos descripcion',descripcion );
  console.log('setProductos descripcionAdicional',descripcionAdicional );
  console.log('setProductos unidadMedStock',unidadMedStock );


  // return new Observable((observer) => {

    let producto={};
    producto[codigoProducto]={
        COD_ARTICU:codigoProducto,
        DESCRIPCIO:descripcion,
        DESC_ADIC:descripcionAdicional,
        ID_MEDIDA_STOCK:unidadMedStock
        };
    this.refProductosPedidos.doc(codigoEmpresa).set(producto,{merge: true}).then((Response) => {
      console.log('setProductos Response ',Response);
      // observer.next();
    }).catch((error)=>
    {console.log("setProductos",error);}
    );
  // });
}

/// Retorna los productos que se reciben de los pedidos que pasaron por la aplicacion
getProductos(codigoEmpresa: string   ): Observable<any> {
  console.log('getProductos');
  return new Observable((observer) => {
     let listaProductos=[];
     this.refProductosPedidos.doc(codigoEmpresa).get()
    .then(doc => {

      console.log("getProductos doc",doc);





        let data = doc.data();

        console.log("getProductos data",data);


        for (let  i in data) {
          listaProductos.push(data[i]);
             // console.log(i);
             // console.log( data[i]);
            }
        // listaProductos.push({

        //   key: doc.id,
        //   DESCRIPCIO:data.DESCRIPCIO,
        //   DESC_ADIC: data.DESC_ADIC,
        //   ID_MEDIDA_STOCK: data.ID_MEDIDA_STOCK
        //   // email: data.email,
        //   // empresas: data.empresas,
        //   // estado: data.estado,
        //   // operador: data.operador,
        //   // perfil: data.perfil,
        //   // settings:data.settings,
        //   // timeStamp: data.timeStamp
        // });
      // });
       console.log('getProductos',listaProductos);
      observer.next({listaProductos});
    });
  });
}



crearPedidoWeb(perfilUsuario: any, empresaSelected: any, items: any ,fechaEntrega:{},comentario:string  ):  Observable<any> {
  console.log('crearPedidoWeb');
  console.log('crearPedidoWeb perfilUsuario: ', perfilUsuario);
  console.log('crearPedidoWeb codigoEmpresa',empresaSelected);
  console.log('crearPedidoWeb items',items );

  return new Observable((observer) => {

  const refTotalesPedidosWeb=firebase.firestore().collection('PedidosWeb').doc('totales');

  var transaction = firebase.firestore().runTransaction((t) => {

   return t.get(firebase.firestore().collection('PedidosWeb').doc('totales'))
      .then(doc => {
        // Suma uno al Nro de pedidos
        console.log('doc',doc);
        console.log('doc.data().cantidadPedidos',doc.data().cantidadPedidos);
        var NroPedido = doc.data().cantidadPedidos + 1;
        t.update(refTotalesPedidosWeb, { cantidadPedidos:NroPedido });

      const refPedido=  this.refPedidosWeb.doc(NroPedido.toString());
      


      let dataCabecera = {};
            dataCabecera['user'] = perfilUsuario;
            dataCabecera['timeStamp'] = this.timestamp();
            dataCabecera['empresa'] =empresaSelected;
            dataCabecera['fechaEntrega'] =fechaEntrega;
            dataCabecera['comentario'] =comentario;

      let documento={COD_CLIENT:empresaSelected.COD_CLIENT,
                     estado : 'creado',
                     cabecera:dataCabecera,
                     detalle:items,
                     nroPedido:NroPedido
                      }
      console.log('documento',documento);                
      console.log('NroPedido',documento);                


      t.set(refPedido, documento,{merge: true});




        return  Promise.resolve({NroPedido:NroPedido});
      }).catch(err => {
          console.log(' failure doc:', err);
          return  Promise.reject({error:err});
        });

    }).then(result => {
    console.log('Transaction success! ',result);
       observer.next(result);
    }).catch(err => {
    console.log('Transaction failure: ', err);
       observer.error(err);
    });
  });
}


modificarPedidoWeb(perfilUsuario: any, empresaSelected: any, items: any ,fechaEntrega:{},comentario:string , NroPedido: number  ):  Observable<any> {
  console.log('modificarPedidoWeb');
  console.log('modificarPedidoWeb perfilUsuario: ', perfilUsuario);
  console.log('modificarPedidoWeb codigoEmpresa',empresaSelected);
  console.log('modificarPedidoWeb items',items );
  console.log('modificarPedidoWeb NroPedido',NroPedido );


return new Observable((observer) => {


      const refPedido=  this.refPedidosWeb.doc(NroPedido.toString());

  let dataCabecera = {};
            dataCabecera['user'] = perfilUsuario;
            dataCabecera['timeStamp'] = this.timestamp();
            dataCabecera['empresa'] =empresaSelected;
            dataCabecera['fechaEntrega'] =fechaEntrega;
            dataCabecera['comentario'] =comentario;


      let documento={COD_CLIENT:empresaSelected.COD_CLIENT,
                     estado : 'creado',
                     cabecera:dataCabecera,
                     detalle:items
                     // nroPedido:NroPedido   No actualizo este campo para que no lo transforme en string y se cambie el indice.
                      }

         refPedido.update(documento).then(result => {

        console.log('Transaction success! ',result);
         observer.next(result);
      }).catch(err => {
  console.log('Transaction failure: ', err);
   observer.error(err);
});
});
}

  procesarPedidoWeb(perfilUsuario: any, refTango: any, estado: any ,NroPedido:number  ):  Observable<any> {
    console.log('procesarPedidoWeb');
    console.log('procesarPedidoWeb perfilUsuario: ', perfilUsuario);
    console.log('procesarPedidoWeb refTango',refTango);
    console.log('procesarPedidoWeb estado',estado );
    console.log('procesarPedidoWeb NroPedido',NroPedido );
    return new Observable((observer) => {


    const refPedido=  this.refPedidosWeb.doc(NroPedido.toString());

    let dataProcesamiento = {};
            dataProcesamiento['user'] = perfilUsuario;
            dataProcesamiento['refTango'] = refTango;
            dataProcesamiento['timeStamp'] = this.timestamp();
           


    let documento={
                 estado : estado,
                 dataProcesamiento:dataProcesamiento,
                };

         refPedido.update(documento).then(result => {
            console.log('Transaction success! ',result);
            observer.next(result);
          }).catch(err => {
            console.log('Transaction failure: ', err);
           observer.error(err);
          });
        });
  }

  cancelarPedidoWeb(perfilUsuario: any, NroPedido:number  ):  Observable<any> {
    console.log('cancelarPedidoWeb');
    console.log('cancelarPedidoWeb perfilUsuario: ', perfilUsuario);
   
   
    console.log('cancelarPedidoWeb NroPedido',NroPedido );
    return new Observable((observer) => {


    const refPedido=  this.refPedidosWeb.doc(NroPedido.toString());

    let dataCancelado = {};
            dataCancelado['user'] = perfilUsuario;
            // dataProcesamiento['refTango'] = refTango;
            dataCancelado['timeStamp'] = this.timestamp();
           


    let documento={
                 estado : 'cancelado',
                 dataCancelado:dataCancelado,
                };

         refPedido.update(documento).then(result => {
            console.log('Transaction success! ',result);
            observer.next(result);
          }).catch(err => {
            console.log('Transaction failure: ', err);
           observer.error(err);
          });
        });
  }

// retorna todos los pedidos Web de un cliente (no filtra por estado)
getPedidosWeb( codigoEmpresa: string ): Observable<any> {
  console.log('getPedidosWeb firebase');
  return new Observable((observer) => {
     // this.refPedidosWeb.where('COD_CLIENT', '==', codigoEmpresa).orderBy('nroPedido', 'desc').onSnapshot((querySnapshot) => {
     this.refPedidosWeb.where('COD_CLIENT', '==', codigoEmpresa).orderBy('nroPedido', 'desc').onSnapshot((querySnapshot) => {
      let listaPedidos = [];
      console.log("getPedidosWeb querySnapshot",querySnapshot);
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        // console.log("getPedidosWeb",doc);
        // console.log("getPedidosWeb data",data);
        // console.log("getPedidosWeb doc.id",doc.id);
        // console.log("getPedidosWeb data.cabecera",data.cabecera);
        // console.log("getPedidosWeb data.detalle",data.detalle);
        listaPedidos.push({

              NRO_PEDIDO: doc.id,
              estado : data.estado,
              cabecera:data.cabecera,
              detalle:data.detalle,
              dataProcesamiento:data.dataProcesamiento,
              
         });
      });
      console.log('getPedidosWeb',listaPedidos);
      observer.next(listaPedidos);
    });
  });
}

// retorna todos los pedidos Web de un clientefiltrados por estado
getPedidosWebEstado( codigoEmpresa: string, estado: string  ): Observable<any> {
  console.log('getPedidosWeb firebase');
  return new Observable((observer) => {
     // this.refPedidosWeb.where('COD_CLIENT', '==', codigoEmpresa).orderBy('nroPedido', 'desc').onSnapshot((querySnapshot) => {
     this.refPedidosWeb.where('COD_CLIENT', '==', codigoEmpresa).where('estado', '==', estado).orderBy('nroPedido', 'desc').onSnapshot((querySnapshot) => {
      let listaPedidos = [];
      console.log("getPedidosWeb querySnapshot",querySnapshot);
      querySnapshot.forEach((doc) => {
        let data = doc.data();

        listaPedidos.push({

              NRO_PEDIDO: doc.id,
              estado : data.estado,
              cabecera:data.cabecera,
              detalle:data.detalle,
              dataProcesamiento:data.dataProcesamiento,
              
         });
      });
      console.log('getPedidosWeb',listaPedidos);
      observer.next(listaPedidos);
    });
  });
}


///Retorna todos los pedidos web de un estado
getPedidosWebGestor( estado: string  ): Observable<any> {
  console.log('getPedidosWeb firebase');
  return new Observable((observer) => {
     
     this.refPedidosWeb.where('estado', '==', estado).orderBy('nroPedido', 'desc').onSnapshot((querySnapshot) => {
      let listaPedidos = [];
      console.log("getPedidosWeb querySnapshot",querySnapshot);
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        // console.log("getPedidosWeb",doc);
        // console.log("getPedidosWeb data",data);
        // console.log("getPedidosWeb doc.id",doc.id);
        // console.log("getPedidosWeb data.cabecera",data.cabecera);
        // console.log("getPedidosWeb data.detalle",data.detalle);
        listaPedidos.push({
              NRO_PEDIDO: doc.id,
              estado : data.estado,
              cabecera:data.cabecera,
              detalle:data.detalle,
              dataProcesamiento:data.dataProcesamiento,


              
         });
      });
      console.log('getPedidosWeb',listaPedidos);
      observer.next(listaPedidos);
    });
  });
}

///Retorna todos los pedidos web de un estado
getPedidosWebGestorXFecha( ZfechaDesde: any , ZfechaHasta:any,creado:boolean,procesado:boolean, cancelado:boolean ): Observable<any> {
  console.log('getPedidosWebGestorXFecha firebase');
  console.log('getPedidosWebGestorXFecha ZfechaDesde',ZfechaDesde);
  console.log('getPedidosWebGestorXFecha ZfechaHasta',ZfechaHasta);
  console.log('getPedidosWebGestorXFecha creado',creado);
  console.log('getPedidosWebGestorXFecha procesado',procesado);
  console.log('getPedidosWebGestorXFecha cancelado',cancelado);
  let fechaDesde= new Date(ZfechaDesde.month+'/'+ZfechaDesde.day+'/'+ZfechaDesde.year);
   let fechaHasta= new Date(ZfechaHasta.month+'/'+ZfechaHasta.day+'/'+ZfechaHasta.year);
   fechaHasta.setHours(24,0,0);
  return new Observable((observer) => {
   
   // let fechaDesde= new Date('2018-11-02');
   // let fechaHasta= new Date('2019-08-14');

   console.log('getPedidosWebGestor fechaDesde ',fechaDesde);
   console.log('getPedidosWebGestor fechaHasta ',fechaHasta);
   let busqueda:any=null;

   if((creado&&procesado&&cancelado)||(!creado&&!procesado&&!cancelado)){
     busqueda=this.refPedidosWeb
       .where('cabecera.timeStamp', '<=', fechaHasta)
       .where('cabecera.timeStamp', '>=', fechaDesde)
       .orderBy('cabecera.timeStamp', 'desc');
   }else if(creado){
     busqueda=this.refPedidosWeb
         .where('cabecera.timeStamp', '<=', fechaHasta)
         .where('cabecera.timeStamp', '>=', fechaDesde)
         .where('estado', '==', 'creado') 
         .orderBy('cabecera.timeStamp', 'desc');
   }else if(procesado){
     busqueda=this.refPedidosWeb
         .where('cabecera.timeStamp', '<=', fechaHasta)
         .where('cabecera.timeStamp', '>=', fechaDesde)
         .where('estado', '==', 'Procesado') 
         .orderBy('cabecera.timeStamp', 'desc');
   }else if(cancelado){
     busqueda=this.refPedidosWeb
         .where('cabecera.timeStamp', '<=', fechaHasta)
         .where('cabecera.timeStamp', '>=', fechaDesde)
         .where('estado', '==', 'cancelado') 
         .orderBy('cabecera.timeStamp', 'desc');
   }
     
   busqueda.onSnapshot((querySnapshot) => {
      let listaPedidos = [];
      console.log("getPedidosWeb querySnapshot",querySnapshot);
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        // console.log("getPedidosWeb",doc);
        // console.log("getPedidosWeb data",data);
        // console.log("getPedidosWeb doc.id",doc.id);
        // console.log("getPedidosWeb data.cabecera",data.cabecera);
        // console.log("getPedidosWeb data.detalle",data.detalle);
        listaPedidos.push({

             NRO_PEDIDO: doc.id,
              estado : data.estado,
              cabecera:data.cabecera,
              detalle:data.detalle,
              dataProcesamiento:data.dataProcesamiento,

              
         });
      });
      console.log('getPedidosWeb',listaPedidos);
      observer.next(listaPedidos);
    });
  });
}




crearAlerta(perfilUsuario: any, empresaSelected: any, alerta: any   ): Observable<any> {
  console.log('crearAlerta');
  console.log('crearAlerta perfilUsuario: ', perfilUsuario);
  console.log('crearAlerta codigoEmpresa',empresaSelected);
  console.log('crearAlerta alerta',alerta );
 return new Observable((observer) => {
  const COD_CLIENT=empresaSelected.COD_CLIENT;

  const refAlerta  =this.refAlertasReposicion.doc(COD_CLIENT);



var transaction = firebase.firestore().runTransaction((t) => {



  let documento={COD_CLIENT:empresaSelected.COD_CLIENT,
                 empresa:empresaSelected,
                 };



      return  t.get(refAlerta).then(doc => {

        console.log('doc',doc);
          alerta['estado']= 'activo';
          alerta['timeStamp'] = new Date();

          if (!doc.data()) {
                const listaAlertas=[alerta];
                documento['listaAlertas']=listaAlertas;
                t.set(refAlerta,documento);
            } else {
                const listaAlertas = doc.data().listaAlertas;
                listaAlertas.push(alerta);
                t.update(refAlerta, { listaAlertas: listaAlertas });
            }

        return  Promise.resolve('listaAlertas increased to ' );

          }).catch(err => {
        console.log(' failure doc:', err);
        return  Promise.reject('NroPedido err to ' + err);

      });

    }).then(result => {
      console.log('crearAlerta success! ',result);
       observer.next(result);
      }).catch(err => {
    console.log('crearAlerta failure: ', err);
     observer.error(err);
   });
   });
 };



modificarAlerta(perfilUsuario: any, codCliente: any, alerta: any ,idAlerta:number   ):  Observable<any> {
  console.log('modificarAlerta');
  console.log('modificarAlerta perfilUsuario: ', perfilUsuario);
  console.log('modificarAlerta codigoEmpresa',codCliente);
  console.log('modificarAlerta alerta',alerta );
 return new Observable((observer) => {


  const refAlerta  =this.refAlertasReposicion.doc(codCliente);



var transaction = firebase.firestore().runTransaction((t) => {



  


      return  t.get(refAlerta).then(doc => {

        console.log('doc',doc);
          alerta['estado']= 'activo';
          alerta['timeStamp'] = new Date();

          if (!doc.data()) {
                //Error no hago nadao

            } else {
                const listaAlertas = doc.data().listaAlertas;
                listaAlertas[idAlerta]=alerta;
                t.update(refAlerta, { listaAlertas: listaAlertas });
            }

        return  Promise.resolve('listaAlertas increased to ' );
          }).catch(err => {
        console.log(' failure doc:', err);
        return  Promise.reject('NroPedido err to ' + err);

      });

    }).then(result => {
      console.log('crearAlerta success! ',result);
        observer.next(result);
      }).catch(err => {
    console.log('crearAlerta failure: ', err);
     observer.error(err);
   });
   });
 };



borrarAlerta( codEmpresa: any, alerta: any ,idAlerta:number   ):  Observable<any> {
  console.log('modificarAlerta');

  console.log('modificarAlerta codigoEmpresa',codEmpresa);
  console.log('modificarAlerta alerta',alerta );
 return new Observable((observer) => {
  // const COD_CLIENT=empresaSelected.COD_CLIENT;

  const refAlerta  =this.refAlertasReposicion.doc(codEmpresa);



var transaction = firebase.firestore().runTransaction((t) => {



 



      return  t.get(refAlerta).then(doc => {

        console.log('doc',doc.data());
          alerta['estado']= 'cancelada';
          alerta['timeStamp'] = new Date();

          if (!doc.data()) {
                //Error no hago nadao

            } else {
                const listaAlertas = doc.data().listaAlertas;
                listaAlertas.splice(idAlerta,1);[]=alerta;

                t.update(refAlerta, { listaAlertas: listaAlertas });
            }

        return  Promise.resolve('listaAlertas increased to ' );
          }).catch(err => {
        console.log(' failure doc:', err);
        return  Promise.reject('NroPedido err to ' + err);

      });

    }).then(result => {
      console.log('crearAlerta success! ',result);
        observer.next(result);
      }).catch(err => {
    console.log('crearAlerta failure: ', err);
     observer.error(err);
   });
   });
 };



/// Retorna las alertas seguon el codigo de cliente
getAlertas( codigoEmpresa: string  ): Observable<any> {
  console.log('getAlertas');

  return new Observable((observer) => {
      let listaAlertas = [];
       this.refAlertasReposicion.doc(codigoEmpresa).get()
          .then(doc => {
          console.log("getAlertas doc",doc);
          if(doc.exists){
          let data = doc.data();
          data.listaAlertas.forEach((alerta) => {
          listaAlertas.push(alerta);
         });
        }

      console.log('getAlertas',listaAlertas);
      observer.next(listaAlertas);
    });
  });
}


/// Retorna Todas alertas 
getTodasLasAlertas(  ): Observable<any> {
  console.log('getAlertas');

  return new Observable((observer) => {
      let listaAlertas = [];


       this.refAlertasReposicion.onSnapshot((querySnapshot) => {
      let listaDeAlertas = [];
      console.log("getTodasLasAlertas querySnapshot",querySnapshot);
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        console.log("getTodasLasAlertas",doc);
        console.log("getTodasLasAlertas data",data);
        console.log("getTodasLasAlertas doc.id",doc.id);


        for (var i = 0; i < data.listaAlertas.length; i++) {

                let diaActuliazacionCarga=data. listaAlertas[i].diaActuliazacionCarga;
                   console.log("diaActuliazacionCarga ", diaActuliazacionCarga);
                   var d = new Date("02/07/2011"); // "mm/dd/yyyy"  
                   // var fechacalculo = new Date(diaActuliazacionCarga.ano+'-'+diaActuliazacionCarga.mes+'-'+diaActuliazacionCarga.dia).getTime();
                  var fechacalculo = new Date(diaActuliazacionCarga.mes+'/'+diaActuliazacionCarga.dia+'/'+diaActuliazacionCarga.ano).getTime();
                   var hoy = new Date().getTime();

                
                  var diff = Math.trunc((hoy - fechacalculo)/86400000);//1000*60*60*24

                   console.log('diff: ',diff );
                
                 let stokConsumido=(data. listaAlertas[i].cantidadDeAnimales*data. listaAlertas[i].consumoDiario*diff) ;
                  console.log('diff stokConsumido: ',stokConsumido);
                 let stockDisponible= data. listaAlertas[i].stockDespuesUltimaCarga-stokConsumido;
                 console.log('stockDisponible: ',stockDisponible );

                  let diasDeAlimentoDisponible=   (stockDisponible/(data. listaAlertas[i].cantidadDeAnimales*data. listaAlertas[i].consumoDiario)) ;  

          
               let capacidadAlamcenamientoDisponible=data.listaAlertas[i].capacidadDeAlmacenamiento- stockDisponible;
 

  
   
 


              


           let alerta={empresa: data.empresa,        
                      alerta: data. listaAlertas[i],
                      stockDisponible:stockDisponible,
                      capacidadAlamcenamientoDisponible:capacidadAlamcenamientoDisponible,
                      diasDeAlimentoDisponible: Math.trunc(diasDeAlimentoDisponible),
                       alertaIndex:i};
            listaDeAlertas.push(alerta);  
        }
 
      });
      console.log('getTodasLasAlertas',listaDeAlertas);
      observer.next(listaDeAlertas);
    })
    
  });
}

actualizarStocksEnAlerta(COD_CLIENT: string, alerta: any ):  Observable<any> {
    console.log('actualizarStocksEnAlerta');
    console.log('actualizarStocksEnAlerta COD_CLIENT',COD_CLIENT);
    console.log('actualizarStocksEnAlerta alerta', alerta);
 
    return new Observable((observer) => {


     const refAlerta  =this.refAlertasReposicion.doc(COD_CLIENT);
        

        refAlerta.update({ listaAlertas: alerta }).then(result => {
            console.log('Transaction success! ',result);
            observer.next(result);
          }).catch(err => {
            console.log('Transaction failure: ', err);
           observer.error(err);
          });
        });
  }

 // updateToken(userKey: string, token: string  ) {
 //    // we can change this function to request our backend service

 //        const data = {};
 //        data[userKey] = token;

 //      const batch = firebase.firestore().batch();
 //           // this.reffcmTokens.doc(userKey+"/"+codigoEmpresa+"/"+codigoProducto)
 //    this.reffcmTokens.doc(userKey)
 //    .set(
 //      {
 //        token:token,
 //        // DESC_ADIC:descripcionAdicional,
 //        // ID_MEDIDA_STOCK:unidadMedStock
 //       }).then((Response) => {
 //      console.log('updateToken Response ',Response);
 //      // observer.next();
 //    }).catch((error)=>
 //    {console.log("updateToken",error);}
 //    );



 //  }


 updateToken(perfilUser: any, token: string  ) {

    const batch = firebase.firestore().batch();
    // Graba el token para el ususario
    // fcmToken-userKey-token-el valor asignado
    batch.set(this.reffcmTokens.doc(perfilUser.key), { token:token},{merge: true});
    //  Graba el token para cada una de las empresas asignadas al usuario.
   // fcmTokenEmpresas-COD_CLIENT-userKey-el valor asignado al Token
    for(const empresa of perfilUser.data.empresas) {
            const data = {};
            data[perfilUser.key] = token;
            const keyRef=  firebase.firestore().collection('fcmTokensEmpresas').doc(empresa.COD_CLIENT);
            batch.set(keyRef, data,{merge: true});
    };
    batch.commit().then((Response) => {
      console.log('updateToken Response ',Response);

    }).catch((error)=>
    {console.log("updateToken",error);}
    );
    }

  procesarSolicitud1(perfilUsuario: any,  estado: any ,uid:any  ): Observable<any> {
    console.log('procesarSolicitud');
    console.log('procesarSolicitud perfilUsuario: ', perfilUsuario);
    console.log('procesarSolicitud estado',estado);
    console.log('procesarSolicitud uid',uid );
    return new Observable((observer) => {

      const refPedido=  this.refSolicitudes.doc(uid.toString());
      let dataProcesamiento = {};
      dataProcesamiento['user'] = perfilUsuario;
      dataProcesamiento['timeStamp'] = this.timestamp();
      let documento={
                     estado : estado,
                     dataProcesamiento:dataProcesamiento,
                     
                      }

         refPedido.update(documento).then(result => {

        console.log('Transaction success! ',result);
         observer.next(result);
      }).catch(err => {
    console.log('Transaction failure: ', err);
    observer.error(err);
     });
    }); 
  }




}


