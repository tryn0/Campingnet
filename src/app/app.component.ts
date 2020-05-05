import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';

import { encriptar, desencriptar } from './crypto-storage';

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

    this.http.get("http://localhost/crypto.php").subscribe(data =>{
      if(data != null){
        let key = data as string;

        //Mensaje de información
        if(localStorage.getItem('mensaje') == null && key != null){
          this.mensaje = this._snackBar.open('Le informamos que usamos cookies para mejorar el servicio.','No mostrar más.');
          //Cuando se acepta el mensaje
          this.mensaje.afterDismissed().subscribe(() => {
            localStorage.setItem('mensaje', encriptar('0', key));
          });      
        }

        //Comprobar si hay algún usuario con sesión iniciada
        if(localStorage.getItem('usuarioActual') != null && key != null){
          this.usuarioActual = desencriptar(localStorage.getItem('usuarioActual'), key);
        }

      }
    }); 

  }

  logOff(){
    localStorage.removeItem("usuarioActual");
    window.location.reload();
  }


  ngOnInit(): void {  


    this.route.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        //console.log(e.url);
        if(e.url == '/dashboard'){
          this.dashboard = true;
        }else{
          this.dashboard = false;
        }
      }
    });
  }
}
