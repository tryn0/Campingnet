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
  
  public menuMensaje: string = 'Cerrar menú';

  @ViewChild('menu') drawer: MatDrawer;

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

  
  togle(){
    if(this.drawer.opened){
      this.drawer.close();
      this.menuMensaje = 'Abrir menú';
    }else{
      this.drawer.open();
      this.menuMensaje = 'Cerrar menú';
    }

  }


  logOff(){
    localStorage.removeItem("usuarioActual");
    window.location.reload();
  }


  ngOnInit(): void {  

    let param = new HttpParams()
    .set('opcion','1');

    this.route.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        //console.log(e.url);
        if(e.url.length >= 10 && e.url.slice(0, 10) == '/dashboard'){
          this.dashboard = true;

        }else{
          this.dashboard = false;
        }
      }
    });
  }
}
