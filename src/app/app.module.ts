import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from "@angular/forms";

//Componentes para Angular
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IgxCarouselModule } from 'igniteui-angular';

//Componentes añadidos
import { HomeComponent } from './home/home.component';
import { ReservasComponent } from './reservas/reservas.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { AlojamientoComponent } from './alojamiento/alojamiento.component';
import { NoencontradoComponent } from './noencontrado/noencontrado.component';
import { PaneldeControlComponent } from './panelde-control/panelde-control.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ReservasComponent,
    AboutComponent,
    ContactComponent,
    LoginComponent,
    RegistrarComponent,
    UsuarioComponent,
    AlojamientoComponent,
    NoencontradoComponent,
    PaneldeControlComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatDividerModule,
    MatSnackBarModule,
    FlexLayoutModule,
    IgxCarouselModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
