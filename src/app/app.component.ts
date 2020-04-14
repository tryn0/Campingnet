import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { HttpClient  } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'CampingNet';

  public usuarioActual: any;

  public mensaje: any;

  public trigger: boolean = false;

  public ip: string;

  constructor(private http: HttpClient, private _snackBar: MatSnackBar, public router: Router, public ar: ActivatedRoute) {

    //Mensaje de información
    if(localStorage.getItem('mensaje') != '0'){
      this.mensaje = this._snackBar.open('Le informamos que su información se guarda en su dispositivo.','No mostrar más.');
      //Cuando se acepta el mensaje
      this.mensaje.afterDismissed().subscribe(() => {
        localStorage.setItem('mensaje', '0');
      });      
    }

    // Para obtener la IP
    this.http.get("http://api.ipify.org/?format=json").subscribe((res:any) =>{
      this.ip = res.ip;
    });
    
    //Comprobar si hay algún usuario con sesión iniciada
    this.usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    //console.log(this.usuarioActual);
  }

  logOff(){
    localStorage.removeItem("usuarioActual");
    window.location.reload();
  }

  ngOnInit(): void {  
  }
}
