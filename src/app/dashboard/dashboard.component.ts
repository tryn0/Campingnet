import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../usuario/usuario';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public usuarioActual: Usuario;

  constructor(private router: ActivatedRoute, private http: HttpClient, private route: Router) {
    //console.log(this.router.snapshot.url[0].path);
  }

  /**
   * TODO: Crear una vista como login para permitir iniciar sesión y si inicia sesión refrescar esta página y compruebe el rol.
   * TODO: Si el rol es cliente redirigir a inicio. Si el rol no es cliente permitir ver el dashboard en todo momento. Esto se hace con una variable boolean, si es true ver el dashboard, sino pues redirige a inicio.
   */
  ngOnInit(): void {

    // Comprobación de que exista una sesion iniciada

    this.usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

    // Si no existe una sesión de usuario dar oportunidad de loguearse
    if(this.usuarioActual == null){
      // Permitir loguearse y cuando inicie sesión refrescar la página, para que vuelva a entrar a este bloque y compruebe si es o no trabajador.

    }else if(this.usuarioActual['rol'] != 'cliente'){ // Si existe una sesion de usuario y no es cliente (osea es trabajador o admin)

      console.log(this.usuarioActual);
      // Poner variable a true para que pueda acceder al dashboard

    }else{ // Si no es admin o trabajador, redirigir al inicio
      //this.route.navigate(['/']);
    }
    
  }

}
