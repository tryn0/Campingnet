import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Usuario } from '../usuario/usuario';
import { MatDrawer } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { encriptar, desencriptar } from '../crypto-storage';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

/**
 * ? Para ver cómo va el proceso
 * ? https://trello.com/b/4xofW6oE
 */

  title = 'Administración';

  public trabajador: boolean = false;

  public menuMensaje: string = 'Menú';

  @ViewChild('menu') drawer: MatDrawer;

  public pantalla: boolean = false;

  public reservasHoy: number = 0;

  public reservasHoySalidas: number = 0;

  public revisarResenias: number = 0;

  public usuarioActual: Usuario;

  public reservasList: any = [];

  constructor( private http: HttpClient, private route: Router, breakpointObserver: BreakpointObserver) {
    //console.log(this.router.snapshot.url[0].path);
    breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(res => {
      const md = breakpointObserver.isMatched('(max-width: 770px)')
      this.pantalla = md;
    })
  }

  togle(){ // Texto de cerrar abrir menú y la acción de abrir cerrar menú
    if(this.drawer.opened){
      this.drawer.close();
    }else{
      this.drawer.open();
    }

  }

  logOff(){ // Cerrar sesión
    localStorage.removeItem("usuarioActual");
    window.location.reload();
  }


  ngOnInit(): void {

    

    if(localStorage.getItem('usuarioActual') != null){
      this.usuarioActual = desencriptar(localStorage.getItem('usuarioActual'));
      if(this.usuarioActual['rol'] == 'cliente'){
        window.location.href = 'http://localhost:4200/';
      }else{
        this.trabajador = true;
      }
    }else{
      window.location.href = 'http://localhost:4200/';
    }

    // Entradas
    let entrada = new HttpParams()
    .set('opcion', '1');

    this.http.post<any>("http://localhost/dashboard.php", entrada).subscribe(data =>{ // Obtener key de crypto.php
      if(data != null){
        this.reservasHoy = data[0]['COUNT(*)'];
      }
    });
    
    // Salidas
    let salida = new HttpParams()
    .set('opcion', '2');

    this.http.post<any>("http://localhost/dashboard.php", salida).subscribe(data =>{ // Obtener key de crypto.php
      if(data != null){
        this.reservasHoySalidas = data[0]['COUNT(*)'];
      }
    });

    // Reseñas por revisar
    let resenias = new HttpParams()
    .set('opcion', '3');

    this.http.post<any>("http://localhost/dashboard.php", resenias).subscribe(data =>{ // Obtener key de crypto.php
      if(data != null){
        this.revisarResenias = data[0]['COUNT(*)'];
      }
    });

    // últimas 10 reservas
    let reservas = new HttpParams()
    .set('opcion', '4');

    this.http.post<any>("http://localhost/dashboard.php", reservas).subscribe(data =>{ // Obtener key de crypto.php
      if(data != null){
        this.reservasList = data;
      }
    });
    

  }

}
