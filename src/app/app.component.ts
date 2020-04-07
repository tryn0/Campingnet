import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CampingNet';
  public usuarioActual: any;
  public mensaje;
  public trigger: boolean = false;

  constructor(private _snackBar: MatSnackBar, public router: Router, public ar: ActivatedRoute) {
    //Mensaje de información
    if(localStorage.getItem('mensaje') != '0'){
      this.mensaje = this._snackBar.open('Guardamos su información de forma local, gracias.','Ok');
      //Cuando se acepta el mensaje
      this.mensaje.afterDismissed().subscribe(() => {
        localStorage.setItem('mensaje', '0');
      });

      
    }
    
    

    //Comprobar si hay algún usuario con sesión iniciada
    this.usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    //console.log(this.usuarioActual.nombre);
  }

  logOff(){
    localStorage.removeItem("usuarioActual");
    window.location.reload();

  }

  ngOnInit(): void {    
  }

}
