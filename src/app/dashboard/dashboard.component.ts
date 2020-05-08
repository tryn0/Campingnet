import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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

  //title = 'Administración';

  // Variable que indica si es un trabajador o no, si un cliente entra a la parte dashboard, no verá nada, solo el cargador y será redireccionado al Inicio
  public trabajador: boolean = false;

  // Variable que contiene el texto que muestra el botón del menú lateral
  public menuMensaje: string = 'Menú';

  // Menú lateral
  @ViewChild('menu') drawer: MatDrawer;

  public pantalla: boolean = false;

  // Variables del número de los cuadrados de inicio
  public reservasHoy: number = 0;
  public reservasHoySalidas: number = 0;
  public revisarResenias: number = 0;

  // Variable de usuario con sesión iniciada
  public usuarioActual: Usuario;

  // Lista de las últimas 10 reservas
  public reservasList: any = [];

  // Variables de las rutas, control de vista
  public dashboardInicio: boolean = false;
  public dashboardRevisarResenias: boolean = false;
  public dashboardSalidasHoy: boolean = false;
  public dashboardEntradasHoy: boolean = false;
  public dashboardReservas: boolean = false;
  public dashboardResenias: boolean = false;
  public dashboardUsuarios: boolean = false;
  public dashboardServicios: boolean = false; // todo: Pendiente de si dejarlo o meterlo en la parte /dashboard/admin
  public dashboardAdmin: boolean = false;

  // variables revisar-resenias
  public listadoResenias: any = [];
  public items = [];
  public listadoReseniasAlgo: boolean = false;
  

  constructor( private http: HttpClient, private route: Router, private router: ActivatedRoute, breakpointObserver: BreakpointObserver) {
    
    // Obtiene el tamaño de la pantalla, para 
    breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(res => {
      const md = breakpointObserver.isMatched('(max-width: 768px)')
      this.pantalla = md;
    })
  }

  onChangePage(listadoResenias: Array<any>) {
    // update current page of items
    this.listadoResenias = listadoResenias;
}

  togle(){ // Función para cerrar y abrir el menú lateral
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

  aprobado(idResenia, i, e){
    //console.log(e.path[4])
    
    // Reseña aprobada
    let aprobado = new HttpParams()
    .set('opcion', '8')
    .set('idResenia', idResenia);

    console.log(this.listadoResenias)

    this.http.post<any>("http://localhost/dashboard.php", aprobado).subscribe(data =>{ // Aprobar reseña
      if(data != null){
        if (data == 1){
          this.listadoResenias.splice(i, 1, );
          //e.path[4].remove(); Esto sirve para borrar el elemento del DOM, pero no los borra de la lista
          if(this.listadoResenias.length == 0){
            this.listadoReseniasAlgo = true;
          }
        }
      }
    });

  }

  denegado(idResenia, i, e){

    // Reseña aprobada
    let denegado = new HttpParams()
    .set('opcion', '9')
    .set('idResenia', idResenia);

    this.http.post<any>("http://localhost/dashboard.php", denegado).subscribe(data =>{ // Denegar reseña
      if(data != null){
        this.listadoResenias.splice(i, 1, ); // Quita la reseña de la lista de reseñas
        if(this.listadoResenias.length == 0){ // Y seguidamente comrpueba si queda alguna reseña
          this.listadoReseniasAlgo = true;
        }
      }
    });

  }


  ngOnInit(): void {

    if(localStorage.getItem('usuarioActual') != null){ // Comprobación de que tiene autorización para entrar a la administración
      this.usuarioActual = desencriptar(localStorage.getItem('usuarioActual'));
      if(this.usuarioActual['rol'] == 'cliente'){
        window.location.href = 'http://localhost:4200/';
      }else{
        this.trabajador = true;
      }
    }else{
      window.location.href = 'http://localhost:4200/';
    }

    //console.log(this.router.snapshot.url[1].path);

    if (this.router.snapshot.url.length == 1 && this.router.snapshot.url[0].path == 'dashboard'){
      // Si en la URL es solo /dashboard, carga lso datos de inicio

      /**
       * ? Empieza aquí
       */

      // Puestas las variables a false menos la correspondiente para mostrar su página
      this.dashboardInicio = true;
      this.dashboardRevisarResenias = false;
      this.dashboardSalidasHoy = false;
      this.dashboardEntradasHoy = false;
      this.dashboardReservas = false;
      this.dashboardResenias = false;
      this.dashboardUsuarios = false;
      this.dashboardServicios = false;
      this.dashboardAdmin = false;

      // Entradas
      let entrada = new HttpParams()
      .set('opcion', '1');

      this.http.post<any>("http://localhost/dashboard.php", entrada).subscribe(data =>{ // Obtener las entradas al camping del día
        if(data != null){
          this.reservasHoy = data[0]['COUNT(*)'];
        }
      });
      
      // Salidas
      let salida = new HttpParams()
      .set('opcion', '2');

      this.http.post<any>("http://localhost/dashboard.php", salida).subscribe(data =>{ // Obtener las salidas del camping del día
        if(data != null){
          this.reservasHoySalidas = data[0]['COUNT(*)'];
        }
      });

      // Reseñas por revisar
      let resenias = new HttpParams()
      .set('opcion', '3');

      this.http.post<any>("http://localhost/dashboard.php", resenias).subscribe(data =>{ // Obtener las reseñas que está por ser publicadas
        if(data != null){
          this.revisarResenias = data[0]['COUNT(*)'];
        }
      });

      // últimas 10 reservas
      let reservas = new HttpParams()
      .set('opcion', '4');

      this.http.post<any>("http://localhost/dashboard.php", reservas).subscribe(data =>{ // Obtener las últimas 10 reservas
        if(data != null){
          this.reservasList = data;
        }
      });

      /**
       * ? Acaba aquí
       */

    }else if (this.router.snapshot.url.length > 1 && this.router.snapshot.url[0].path == 'dashboard' && this.router.snapshot.url[1].path == 'revisar-resenias') {
      // Revisar todas las reseñas sin publicar (en la BD publicado a 0), pendientes de aprobar

      /**
       * ? Empieza aquí
       */

      // Puestas las variables a false menos la correspondiente para mostrar su página
      this.dashboardInicio = false;
      this.dashboardRevisarResenias = true;
      this.dashboardSalidasHoy = false;
      this.dashboardEntradasHoy = false;
      this.dashboardReservas = false;
      this.dashboardResenias = false;
      this.dashboardUsuarios = false;
      this.dashboardServicios = false;
      this.dashboardAdmin = false;

      /**
       * ! Aquí va el código de REVISAR RESEÑAS, RESEÑAS SIN PUBLICAR, CUADRADO DERECHO DE INICIO
       */

      let reseniasAprobar = new HttpParams()
      .set('opcion', '5');

      this.http.post < any > ("http://localhost/dashboard.php", reseniasAprobar).subscribe(data => { // Obtener las reseñas que están por ser aprobadas para ser publicadas
        if (data != 0) {
          this.listadoResenias = data;

          this.listadoReseniasAlgo = false;

          for (let i = 0; i < this.listadoResenias.length; i++) {
            const element = this.listadoResenias[i];

            let nombreUser = new HttpParams()
              .set('opcion', '6')
              .set('idUsuario', element['idUsuario']);

            this.http.post < any > ("http://localhost/dashboard.php", nombreUser).subscribe(data => { // Obtener los nombres de todas las reseñas por aprobar
              if (data != null) {
                this.listadoResenias[i].alias_usuario = data[0]['alias_usuario'];
              }
            });

            let idAlojamientoResenia = new HttpParams()
              .set('opcion', '7')
              .set('idResenia', element['idResenia']);

            this.http.post < any > ("http://localhost/dashboard.php", idAlojamientoResenia).subscribe(data => { // Obtener el idAlojamiento de todas las reseñas por aprobar
              if (data != null) {
                this.listadoResenias[i].idAlojamiento = data[0]['idAlojamiento'];
              }
            });

          }
          //console.log(this.listadoResenias)

        } else {
          this.listadoReseniasAlgo = true;
        }
      });

      

      

       /**
        * ? Acaba aquí
        */

    }else if (this.router.snapshot.url.length > 1 && this.router.snapshot.url[0].path == 'dashboard' && this.router.snapshot.url[1].path == 'salidas-hoy') {
      // Todas las reservas que salen del camping en el día

      /**
       * ? Empieza aquí
       */

      // Puestas las variables a false menos la correspondiente para mostrar su página
      this.dashboardInicio = false;
      this.dashboardRevisarResenias = false;
      this.dashboardSalidasHoy = true;
      this.dashboardEntradasHoy = false;
      this.dashboardReservas = false;
      this.dashboardResenias = false;
      this.dashboardUsuarios = false;
      this.dashboardServicios = false;
      this.dashboardAdmin = false;

      /**
       * ! Aquí va el código de SALIDAS HOY, CUADRADO CENTRAL DE INICIO
       */


       /**
        * ? Acaba aquí
        */

    }else if (this.router.snapshot.url.length > 1 && this.router.snapshot.url[0].path == 'dashboard' && this.router.snapshot.url[1].path == 'entradas-hoy') {
      // Todas las reservas que entran al camping en el día

      /**
       * ? Empieza aquí
       */

      // Puestas las variables a false menos la correspondiente para mostrar su página
      this.dashboardInicio = false;
      this.dashboardRevisarResenias = false;
      this.dashboardSalidasHoy = false;
      this.dashboardEntradasHoy = true;
      this.dashboardReservas = false;
      this.dashboardResenias = false;
      this.dashboardUsuarios = false;
      this.dashboardServicios = false;
      this.dashboardAdmin = false;

      /**
       * ! Aquí va el código de ENTRADAS HOY, CUADRADO IZQUIERDO DE INICIO
       */


       /**
        * ? Acaba aquí
        */

    }else if (this.router.snapshot.url.length > 1 && this.router.snapshot.url[0].path == 'dashboard' && this.router.snapshot.url[1].path == 'reservas') {
      // Ver, buscar, editar o eliminar reservas

      /**
       * ? Empieza aquí
       */

      // Puestas las variables a false menos la correspondiente para mostrar su página
      this.dashboardInicio = false;
      this.dashboardRevisarResenias = false;
      this.dashboardSalidasHoy = false;
      this.dashboardEntradasHoy = false;
      this.dashboardReservas = true;
      this.dashboardResenias = false;
      this.dashboardUsuarios = false;
      this.dashboardServicios = false;
      this.dashboardAdmin = false;

      /**
       * ! Aquí va el código de RESERVAS, AQUÍ SE PODRÁ BUSCAR, VER, EDITAR O ELIMINAR RESERVAS
       */


       /**
        * ? Acaba aquí
        */

    }else if (this.router.snapshot.url.length > 1 && this.router.snapshot.url[0].path == 'dashboard' && this.router.snapshot.url[1].path == 'resenias') {
      // Ver, buscar, editar o eliminar reservas

      /**
       * ? Empieza aquí
       */

      // Puestas las variables a false menos la correspondiente para mostrar su página
      this.dashboardInicio = false;
      this.dashboardRevisarResenias = false;
      this.dashboardSalidasHoy = false;
      this.dashboardEntradasHoy = false;
      this.dashboardReservas = false;
      this.dashboardResenias = true;
      this.dashboardUsuarios = false;
      this.dashboardServicios = false;
      this.dashboardAdmin = false;

      /**
       * ! Aquí va el código de RESERVAS, AQUÍ SE PODRÁ BUSCAR, VER, EDITAR O ELIMINAR RESERVAS
       */


       /**
        * ? Acaba aquí
        */

    }else if (this.router.snapshot.url.length > 1 && this.router.snapshot.url[0].path == 'dashboard' && this.router.snapshot.url[1].path == 'usuarios') {
      // Ver, buscar, editar o eliminar usuarios

      /**
       * ? Empieza aquí
       */

      // Puestas las variables a false menos la correspondiente para mostrar su página
      this.dashboardInicio = false;
      this.dashboardRevisarResenias = false;
      this.dashboardSalidasHoy = false;
      this.dashboardEntradasHoy = false;
      this.dashboardReservas = false;
      this.dashboardResenias = false;
      this.dashboardUsuarios = true;
      this.dashboardServicios = false;
      this.dashboardAdmin = false;

      /**
       * ! Aquí va el código de USUARIOS, AQUÍ SE PODRÁ BUSCAR, VER, EDITAR O ELIMINAR USUARIOS, pero NO la contraseña, como en el Panel de Control
       */


       /**
        * ? Acaba aquí
        */

    }else if (this.router.snapshot.url.length > 1 && this.router.snapshot.url[0].path == 'dashboard' && this.router.snapshot.url[1].path == 'servicios') {
      // Aquí sólo se podrán VER los servicios, de ahí que piense solo en ponerlo en admin, o dejarlo igual pero si eres admin poder añadir o editar servicios NUNCA ELIMINAR, YA QUE PUEDE DAR ERRORES EN LA PARTE DE RESERVA

      /**
       * ? Empieza aquí
       */

      // Puestas las variables a false menos la correspondiente para mostrar su página
      this.dashboardInicio = false;
      this.dashboardRevisarResenias = false;
      this.dashboardSalidasHoy = false;
      this.dashboardEntradasHoy = false;
      this.dashboardReservas = false;
      this.dashboardResenias = false;
      this.dashboardUsuarios = false;
      this.dashboardServicios = true;
      this.dashboardAdmin = false;

      /**
       * ! Aquí va el código de SERVICIOS, AQUÍ SE PODRÁ BUSCAR, VER, Y AÑADIR SERVICIOS, pero NO eliminarlos
       */


       /**
        * ? Acaba aquí
        */

    }/*else if (this.router.snapshot.url.length > 1 && this.router.snapshot.url[0].path == 'dashboard' && this.router.snapshot.url[1].path == 'admin') {
      // Aquí sólo se podrán VER los servicios, de ahí que piense solo en ponerlo en admin, o dejarlo igual pero si eres admin poder añadir o editar servicios NUNCA ELIMINAR, YA QUE PUEDE DAR ERRORES EN LA PARTE DE RESERVA

      /**
       * ? Empieza aquí
       */

      // Puestas las variables a false menos la correspondiente para mostrar su página
      /*this.dashboardInicio = false;
      this.dashboardRevisarResenias = false;
      this.dashboardSalidasHoy = false;
      this.dashboardEntradasHoy = false;
      this.dashboardReservas = false;
      this.dashboardResenias = false;
      this.dashboardUsuarios = false;
      this.dashboardServicios = false;
      this.dashboardAdmin = true;

      /**
       * ! PENDIENTE
       */


       /**
        * ? Acaba aquí
        */

    //}

    

    
    

  }

}
