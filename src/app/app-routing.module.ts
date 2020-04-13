import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Componentes añadidos
import { HomeComponent } from './home/home.component';
import { ReservasComponent } from './reservas/reservas.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { AlojamientoComponent } from './alojamiento/alojamiento.component';


//Rutas de la URL
const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full'},
  { path: 'inicio', component: HomeComponent },
  { path: 'acerca', component: AboutComponent },
  { path: 'contacto', component: ContactComponent },
  { path: 'reservas', component: ReservasComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registrar', component: RegistrarComponent },
  { path: 'alojamiento', component: AlojamientoComponent },
  { path: 'alojamiento/:bungalows', component: AlojamientoComponent },
  { path: 'alojamiento/:parcelas', component: AlojamientoComponent },
  { path: '**', redirectTo: 'inicio' }, //Si no existe la página
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
