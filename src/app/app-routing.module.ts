import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogMailComponent } from '../app/log/log-mail/log-mail.component';
import { RegistrarseComponent } from '../app/log/registrarse/registrarse.component';
import { SolicituEmpresaComponent } from '../app/admin/users/solicitu-empresa/solicitu-empresa.component';
const routes: Routes = [
  { path: 'logMail', component: LogMailComponent }
 ,{ path: 'registrarse', component: RegistrarseComponent }
 
  ,{ path: 'solicitudEmpresa', component: SolicituEmpresaComponent }
 ,{ path: '', redirectTo: '/logMail', pathMatch: 'full' } //esto se usa para que funcione cuando no exista la ruta solicitada

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
