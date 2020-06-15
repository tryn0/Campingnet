import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componentes añadidos
import { HomeComponent } from './home/home.component';
import { ReservasComponent } from './reservas/reservas.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ReservasUsuarioComponent } from './reservas-usuario/reservas-usuario.component'
import { LoginComponent } from './login/login.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { AlojamientoComponent } from './alojamiento/alojamiento.component';
import { NoencontradoComponent } from './noencontrado/noencontrado.component';
import { PaneldeControlComponent } from './panelde-control/panelde-control.component';
import { DashboardComponent } from './dashboard/dashboard.component';


// Rutas de la URL
const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'inicio', component: HomeComponent },
  { path: 'acerca', component: AboutComponent },
  { path: 'contacto', component: ContactComponent },
  { path: 'reservas', component: ReservasComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registrar', component: RegistrarComponent },
  { path: 'alojamiento', component: AlojamientoComponent },
  { path: 'alojamiento/bungalows', component: AlojamientoComponent },
  { path: 'alojamiento/parcelas', component: AlojamientoComponent },
  { path: 'alojamiento/bungalows/:numero', component: AlojamientoComponent },
  { path: 'alojamiento/parcelas/:numero', component: AlojamientoComponent },
  { path: 'reserva-usuario', component: ReservasUsuarioComponent },
  { path: 'controlpanel', component: PaneldeControlComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard/reservas', component: DashboardComponent },
  { path: 'dashboard/resenias', component: DashboardComponent },
  { path: 'dashboard/revisar-resenias', component: DashboardComponent },
  { path: 'dashboard/usuarios', component: DashboardComponent },
  { path: 'dashboard/servicios', component: DashboardComponent },
  { path: 'dashboard/entradas-hoy', component: DashboardComponent },
  { path: 'dashboard/salidas-hoy', component: DashboardComponent },
  { path: 'dashboard/admin', component: DashboardComponent },
  { path: 'dashboard/admin/temporadas', component: DashboardComponent },
  { path: 'dashboard/admin/servicios', component: DashboardComponent },

  { path: '404', component: NoencontradoComponent}, // Si hay algún error en alguna página seteada
  { path: '**', component: NoencontradoComponent }, // Si no existe la página
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }