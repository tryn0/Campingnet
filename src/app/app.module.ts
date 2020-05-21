import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from "@angular/forms";

// Componentes para Angular
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IgxCarouselModule } from 'igniteui-angular';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from './material.module';
import { LayoutModule } from '@angular/cdk/layout';
import { NgxPaginationModule } from 'ngx-pagination';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

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
import { DashboardComponent, confirmacion, confirmacionReserva, confirmacionServicio } from './dashboard/dashboard.component';
import { ReservasLoginComponent } from './reservas-login/reservas-login.component';
import { ReservasRegistrarComponent } from './reservas-registrar/reservas-registrar.component';

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
    PaneldeControlComponent,
    DashboardComponent,
    confirmacion,
    confirmacionReserva,
    confirmacionServicio,
    ReservasLoginComponent,
    ReservasRegistrarComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
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
    MatMenuModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FlexLayoutModule,
    IgxCarouselModule,
    MatMomentDateModule,
    MatCheckboxModule,
    MatDialogModule,
    MaterialModule,
    LayoutModule,
    ScrollingModule,
    MatBottomSheetModule,
    NgbModule
  ],
  providers: [
    MatDatepickerModule,
  ],
  bootstrap: [AppComponent],
  entryComponents: [ReservasLoginComponent, confirmacion, confirmacionReserva, confirmacionServicio],
  exports: [AlojamientoComponent]
})
export class AppModule {
}
