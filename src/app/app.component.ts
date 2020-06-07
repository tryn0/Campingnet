import { Component, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';

import { encriptar, desencriptar } from './crypto-storage';
import { MatDrawer } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';

/**
 * Componente principal app
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  /**
   * Varibale para controlar el dashboard
   */
  public dashboard: boolean = false;

  /**
   * Título de la página
   */
  public title = 'CampingNet';

  /**
   * Datos de la sesión de usuario actual
   */
  public usuarioActual: any = null;

  /**
   * Variable de mensaje de cookies
   */
  public mensaje: any;

  /**
   * Variable de la IP a mostrar en el footer
   */
  public ip: string;

  /**
   * Constructor de app
   * @param http 
   * @param _snackBar 
   * @param route 
   */
  constructor(private http: HttpClient, private _snackBar: MatSnackBar, private route: Router) {    
    // Para obtener la IP
    this.http.get("http://api.ipify.org/?format=json").subscribe((res:any) =>{
      this.ip = res.ip;
    });

    //Mensaje de información
    if (localStorage.getItem('mensaje') == null) {
      this.mensaje = this._snackBar.open('Le informamos que usamos cookies para mejorar el servicio.', 'No mostrar más.');
      //Cuando se acepta el mensaje
      this.mensaje.afterDismissed().subscribe(() => {
        localStorage.setItem('mensaje', encriptar('0'));
      });
    }

    //Comprobar si hay algún usuario con sesión iniciada
    if (localStorage.getItem('usuarioActual') != null) {
      this.usuarioActual = desencriptar(localStorage.getItem('usuarioActual'));
    }
  }

  /**
   * Función para cerrar sesión
   */
  logOff(){
    localStorage.removeItem("usuarioActual");
    window.location.reload();
  }

  /**
   * Al iniciar el archivo .ts
   */
  ngOnInit(): void {
    this.route.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        if(e.url.length >= 10 && e.url.slice(0, 10) == '/dashboard'){
          this.dashboard = true;
        }else{
          this.dashboard = false;
        }
      }
    });
  }

  /**
   * Cuando termina de cargar la vista del componente app (para el footer siempre al final)
   */
  ngAfterViewInit(): void {
    let cuerpo: number = document.getElementById('cuerpo').scrollHeight;
    let documento: number = document.documentElement.scrollHeight;
    let toolbar: number = document.getElementById('toolbar').clientHeight;
    let footer: number = document.getElementById('footer').clientHeight;
    let cuerpo2: HTMLElement = document.getElementById('cuerpo');

    let h = documento - cuerpo;

    if(h > 0) {
      cuerpo2.style.minHeight = (h - footer - toolbar) as unknown as string+'px';
    }
  }
}