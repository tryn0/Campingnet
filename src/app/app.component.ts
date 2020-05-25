import { Component, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';

import { encriptar, desencriptar } from './crypto-storage';
import { MatDrawer } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  public dashboard: boolean = false;

  title = 'CampingNet';

  public usuarioActual: any = null;

  public mensaje: any;

  public ip: string;

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

  logOff(){
    localStorage.removeItem("usuarioActual");
    window.location.reload();
  }

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

  ngAfterViewInit(): void { // Footer siempre al final
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