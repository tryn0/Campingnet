import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormGroup, Validators, FormBuilder, FormControl, ValidationErrors } from '@angular/forms';
import { Usuario } from '../usuario/usuario';
import { MatDrawer } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import * as moment from 'moment/moment';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

import { encriptar, desencriptar } from '../crypto-storage';
import { CommonModule } from '@angular/common'; // Prevenir errors *ngIf

// Configuración Datepicker
export const DD_MM_YYYY_Format = {
  parse: {
      dateInput: 'DD/MM/YYYY',
  },
  display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }, // Configuración Datepicker
    {
    provide: DateAdapter,
    useClass: MomentDateAdapter,
    deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  },
  {provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_Format}],
})
export class DashboardComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef; // Elemento con ID scrollMe (listado de servicios extras)
  
  /**
   * ? Para ver cómo va el proceso
   * ? https://trello.com/b/4xofW6oE
   */

  // variable de pagination
  public p: number = 1;

  // Variable que indica si es un trabajador o no, si un cliente entra a la parte dashboard, no verá nada, solo el cargador y será redireccionado al Inicio
  public trabajador: boolean = false;

  // Menú lateral
  @ViewChild('menu') drawer: MatDrawer;

  // Variables para los breakpoints de la pantalla
  public pantalla: boolean = false;
  public pantalla2: boolean = false;

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
  public dashboardServicios: boolean = false;
  public dashboardAdmin: boolean = false;
  public dashboardAdminTemporadas: boolean = false;
  public dashboardAdminServicios: boolean = false;

  // variables revisar-resenias
  public listadoResenias: any = [];
  public listadoReseniasAlgo: boolean = false;

  // Variables salidas-hoy
  public listadoSalidasHoy: any = [];
  public serviciosExtras: any = []; // También es usado en entradas-hoy
  public totalPagar: number = 0;
  public pago: number = 0;

  // Variables entradas-hoy
  public listadoEntradasHoy: any = [];

  // Variables reservas
  public buscarReserva: FormGroup;
  public editarReserva: FormGroup;
  public buscado: boolean = false;
  public listadoBuscado: any = [];
  public reservaSeleccionada: boolean = false;
  public reservaEditar: any;
  public serviciosReservaEditar: any = [];
  public allServices: any = [];
  public totalPersonas: number = 0;
  public fechaVal: boolean = null;
  public errorEdicionReserva: boolean = false;
  public errorFechas: boolean = false;

  // Variables reseñas
  public buscarResenia: FormGroup;
  public reseniasList: any = [];

  // Variables usuarios
  public buscarUsuario: FormGroup;
  public listadoUsuarios: any = [];

  // Variables servicios
  public listadoServicios: any = [];

  // Variables admin/temporadas
  public listadoTemporadas: any = [];
  public dashboardAdminTemporadasEditar: boolean = false;
  public edicionTemporada: FormGroup;
  public temporadaEditar: any;
  public nombreTemp: string;
  public fecha1Temp: any;
  public fecha2Temp: any;
  public multiplicativoTemp: any;
  public errorTemp: boolean = false;
  public agregarTemporada: boolean = false;
  public agregarTemporadas: FormGroup;

  // Variables admin/servicios
  public dashboardServiciosEditar: boolean = false;
  public edicionServicios: FormGroup;
  public servicioAlojamiento: boolean = false;
  public servicioEditar: any;
  public errorGuardarServicio: boolean = false;
  public agregarAlojamiento: boolean = false;
  public addAlojamientoForm: FormGroup;
  public errorAgregarAlojamiento: boolean = false;
  

  constructor( private http: HttpClient, private route: Router, private router: ActivatedRoute, breakpointObserver: BreakpointObserver, public fb: FormBuilder, private _popUp: MatBottomSheet) {

    // Inicializar FormBuilder de buscar reservas
    this.buscarReserva = this.fb.group({
      fechaEntrada: ['', ],
      idReserva: ['', ],
      dniUsuario: ['', [Validators.pattern('^[0-9]{8,8}[A-Za-z]$')]],
    });

    // Inicializar FormBuilder de editar reservas
    this.editarReserva = this.fb.group({
      fechaEntrada: ['', [Validators.required]],
      fechaSalida: ['', [Validators.required]],
      numePersonasAlojamiento: ['', [Validators.required, Validators.min(0)]],
    });

    // Inicializar FormBuilder de buscar reservas
    this.buscarResenia = this.fb.group({
      idResenia: ['', ],
      dniUsuario: ['', [Validators.pattern('^[0-9]{8,8}[A-Za-z]$')]],
      idAlojamiento: ['', ],
    });

    // Inicializar FormBuilder de buscar usuarios
    this.buscarUsuario = this.fb.group({
      alias_usuario: ['', ],
      dniUsuario: ['', [Validators.pattern('^[0-9]{8,8}[A-Za-z]$')]],
      email: ['', ],
    });

    // Inicializar FormBuilder de editar temporadas
    this.edicionTemporada = this.fb.group({
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      nombre: ['', [Validators.required, Validators.maxLength(20)]],
      multiplicador: ['', [Validators.required]],
    });

    // Inicializar FormBuilder de añadido de temporadas
    this.agregarTemporadas = this.fb.group({
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      nombre: ['', [Validators.required, Validators.maxLength(20), Validators.pattern('^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$')]],
      multiplicador: ['', [Validators.required, Validators.max(2)]],
    });

    // Inicializar FormBuilder de editar de servicios
    this.edicionServicios = this.fb.group({
      nombre: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      idServicio: ['',],
      idAlojamiento: ['',]
    });

    this.addAlojamientoForm = this.fb.group({
      tipo: ['', [Validators.required]],
      sombra: [''],
      dimension: [''],
      habitaciones: [''],
      maximo_personas: [''],
      nombre: ['', [Validators.required]],
      precio: ['', [Validators.required]],
    });

    // Obtiene el tamaño de la pantalla, para 
    breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(res => {
      const md = breakpointObserver.isMatched('(max-width: 768px)');
      const sm = breakpointObserver.isMatched('(max-width: 575px)');
      this.pantalla = md;
      this.pantalla2 = sm;
    })
  }

  
  openBottomSheet(nombre): void { // Popup eliminar temporada
    this._popUp.open(confirmacion, {data: {nombre}});
  }

  openBottomSheet2(reserva): void { // Popup eliminar reserva
    this._popUp.open(confirmacionReserva, {data: {reserva}});
  }

  openBottomSheet3(servicio): void { // Popup eliminar servicio (alojamiento)
    this._popUp.open(confirmacionServicio, {data: {servicio}});
  }

  onChangePage($event, lista?) { // Paginación
    if (lista) { // Si se le pasa una lista por parámetro..
      if ($event*10 > lista.length) { // Comprueba si la página actual * 10(reseñas de cada página) es mayor a la cantidad de reseñas restantes si es mayor significa que hay más páginas que reseñas, redirige a la página anterior
        this.p -= 1;
      }else{ // Si hay más reseñas que páginas significa que hay más reseñas que páginas
        this.p = $event
      }
    }else{ // Sino se le pasa una lista por parámetro cambia de página en el pagination normal
      this.p = $event
    }
    
    /**
     * ? Por ejemplo si hay 34 reseñas, tiene que haber 4 páginas, lo hace solo el módulo ngx-pagination
     * ? pero si paso de 34 a 29 tiene que haber 3 páginas, 10 por cada, más el pico en la siguiente
     */
  }

  togle() { // Función para cerrar y abrir el menú lateral
    if(this.drawer.opened){
      this.drawer.close();
    }else{
      this.drawer.open();
    }
  }

  logOff() { // Cerrar sesión
    localStorage.removeItem("usuarioActual");
    window.location.reload();
  }

  aprobado(idResenia) { // Aprueba la reseña
    let aprobado = new HttpParams()
    .set('opcion', '8')
    .set('idResenia', idResenia);

    this.http.post<any>("http://34.206.59.221/dashboard.php", aprobado).subscribe(data =>{ // Aprobar reseña
      if(data != null){
        if (data == 1){
          for (let x = 0; x < this.listadoResenias.length; x++) {
            const element = this.listadoResenias[x];
            if(element['idResenia'] == idResenia){
              this.listadoResenias.splice(x, 1, ); // Quita la reseña de la lista de reseñas
            }
          }
          this.onChangePage(this.p, this.listadoResenias) // Llamada a la función de cambio de página del pagination
          if(this.listadoResenias.length == 0){ // Y seguidamente comprueba si queda alguna reseña
            this.listadoReseniasAlgo = true;
          }
        }
      }
    });
  }

  denegado(idResenia) { // Deniega la reseña
    let denegado = new HttpParams()
    .set('opcion', '9')
    .set('idResenia', idResenia);

    this.http.post<any>("http://34.206.59.221/dashboard.php", denegado).subscribe(data =>{ // Denegar reseña
      if(data != null){
        for (let x = 0; x < this.listadoResenias.length; x++) {
          const element = this.listadoResenias[x];
          if(element['idResenia'] == idResenia){
            this.listadoResenias.splice(x, 1, ); // Quita la reseña de la lista de reseñas
          }
        }
        this.onChangePage(this.p, this.listadoResenias) // Llamada a la función de cambio de página del pagination
        if(this.listadoResenias.length == 0){ // Y seguidamente comprueba si queda alguna reseña
          this.listadoReseniasAlgo = true;
        }
      }
    });
  }

  scrollToBottom(): void { // Scroll de la lista de servicios empieza arriba
    try {
      this.myScrollContainer.nativeElement.scrollTop(this.myScrollContainer.nativeElement.scrollHeight);
    } catch(err) { }                 
  }

  ngAfterViewChecked() { // Listado de servicios extras
    this.scrollToBottom();
  }

  buscarReservas() { //Busca las reservas por fecha, ID de la reserva o por el DNI del cliente
    let fecha: any = '0';
    let idReserva: any = '0';
    let dni: any = '0';

    if (this.buscarReserva.get('fechaEntrada').value != null && this.buscarReserva.get('fechaEntrada').value != '' && !this.buscarReserva.get('fechaEntrada').errors) {
      fecha = (this.buscarReserva.get('fechaEntrada').value).format('YYYY-MM-DD')
    }

    if (this.buscarReserva.get('idReserva').value != null && this.buscarReserva.get('idReserva').value != '' && this.buscarReserva.get('idReserva').value != 0) {
      idReserva = this.buscarReserva.get('idReserva').value;
    }

    if (this.buscarReserva.get('dniUsuario').value != null && this.buscarReserva.get('dniUsuario').value != '' && this.buscarReserva.get('dniUsuario').value != 0 && !this.buscarReserva.get('dniUsuario').hasError('pattern')) {
      dni = (this.buscarResenia.get('dniUsuario').value).slice(0,8)+(this.buscarResenia.get('dniUsuario').value).charAt(8).toUpperCase();
    }

    let params = new HttpParams()
    .set('opcion', '16')
    .set('fechaEntrada', fecha)
    .set('idReserva', idReserva)
    .set('dni', dni);
    this.http.post<any>("http://34.206.59.221/dashboard.php", params).subscribe(data => {
      this.buscado = true;
      if (data != null && data != 0) {
        this.listadoBuscado = data;
        for (let i = 0; i < this.listadoBuscado.length; i++) {
          const element = this.listadoBuscado[i];
          this.serviciosExtras = [];

          let nombreUser = new HttpParams()
          .set('opcion', '6')
          .set('idUsuario', element['idUsuario']);
          this.http.post < any > ("http://34.206.59.221/dashboard.php", nombreUser).subscribe(data => { // Obtener los datos del cliente
            if (data != null && data != 0) {
              this.listadoBuscado[i].alias_usuario = data[0]['alias_usuario'];
              this.listadoBuscado[i].nif = data[0]['nif_usuario'];
              this.listadoBuscado[i].nombre_usuario = data[0]['nombre_usuario'];
              this.listadoBuscado[i].telefono = data[0]['telefono'];
              this.listadoBuscado[i].email = data[0]['email'];
              this.listadoBuscado[i].fecha_entrada = new Date(this.listadoBuscado[i].fecha_entrada).toLocaleDateString("es-ES",{year: "numeric", month:"2-digit", day: "2-digit"});
              this.listadoBuscado[i].fecha_salida = new Date(this.listadoBuscado[i].fecha_salida).toLocaleDateString("es-ES",{year: "numeric", month:"2-digit", day: "2-digit"});
            }
          });

          let idAlojamientoSalidasHoy = new HttpParams()
          .set('opcion', '11')
          .set('idReserva', element['idReserva']);
          this.http.post < any > ("http://34.206.59.221/dashboard.php", idAlojamientoSalidasHoy).subscribe(data => { // Obtener los datos de los alojamientos de la reserva
            if (data != null && data != 0) {
              this.listadoBuscado[i].tipo_alojamiento = data[0]['nombre'];
              this.listadoBuscado[i].idAlojamiento = data[0]['idAlojamiento'];
              this.listadoBuscado[i].precioAlojamiento = data[0]['precio'];

              let numeAlojamiento = new HttpParams()
              .set('opcion', '12')
              .set('idAlojamiento', data[0]['idAlojamiento']);
              this.http.post < any > ("http://34.206.59.221/dashboard.php", numeAlojamiento).subscribe(data => { // Obtener el número del alojamiento
                if (data != null && data != 0) {
                  this.listadoBuscado[i].numeroAlojamiento = data[0]['numeroAlojamiento'];
                  if(data[0]['tipo'] == 'bungalow'){
                    this.listadoBuscado[i].habitaciones = data[0]['habitaciones'];
                    this.listadoBuscado[i].maximo_personas = data[0]['maximo_personas'];
                  }else{
                    this.listadoBuscado[i].dimension = data[0]['dimension'];
                    switch (data[0]['sombra']) {
                      case '0':
                        this.listadoBuscado[i].sombra = "Nada";
                        break;
                      case '1':
                        this.listadoBuscado[i].sombra = "Media";
                        break;

                      case '2':
                        this.listadoBuscado[i].sombra = "Bastante";
                        break;

                      case '3':
                        this.listadoBuscado[i].sombra = 'Mucha';
                        break;

                      default:
                        this.listadoBuscado[i].sombra = "Desconocido";
                        break;
                    }
                  }
                }
              });
            }
          });

          let servicios = new HttpParams()
          .set('opcion', '13')
          .set('idReserva', element['idReserva']);
          this.http.post<any>("http://34.206.59.221/dashboard.php", servicios).subscribe(data => { // Obtener los datos de los servicios contratados
            if (data != null && data != 0) {
              for (let i = 0; i < data.length; i++) {
                const element = data[i];
                delete element.idAlojamiento;
                this.serviciosExtras.push(element);
              }
              this.serviciosExtras.idReserva = element['idReserva'];
            }
          });
        }
      }
    });
  }

  buscarResenias() { //Busca las reseñas por ID de la reseña, DNI del cliente o ID del alojamiento

    let idResenia: any = '0';
    let dni: any = '0';
    let idAlojamiento: any = '0';

    if (this.buscarResenia.get('idResenia').value != null && this.buscarResenia.get('idResenia').value != '' && this.buscarResenia.get('idResenia').value != 0) {
      idResenia = this.buscarResenia.get('idResenia').value;
    }

    if (this.buscarResenia.get('dniUsuario').value != null && this.buscarResenia.get('dniUsuario').value != '' && this.buscarResenia.get('dniUsuario').value != 0 && !this.buscarReserva.get('dniUsuario').hasError('pattern')) {
      dni = (this.buscarResenia.get('dniUsuario').value).slice(0,8)+(this.buscarResenia.get('dniUsuario').value).charAt(8).toUpperCase();
    }

    if (this.buscarResenia.get('idAlojamiento').value != null && this.buscarResenia.get('idAlojamiento').value != '') {
      idAlojamiento = this.buscarResenia.get('idAlojamiento').value;
    }

    let params = new HttpParams()
    .set('opcion', '18')
    .set('idResenia', idResenia)
    .set('dniUsuario', dni)
    .set('idAlojamiento', idAlojamiento);
    this.http.post<any>("http://34.206.59.221/dashboard.php", params).subscribe(data => {
      this.buscado = true;
      if (data != null && data != 0) {
        this.listadoBuscado = data;
        for (let i = 0; i < this.listadoBuscado.length; i++) {
          const element = this.listadoBuscado[i];
          this.serviciosExtras = [];

          let nombreUser = new HttpParams()
          .set('opcion', '6')
          .set('idUsuario', element['idUsuario']);
          this.http.post < any > ("http://34.206.59.221/dashboard.php", nombreUser).subscribe(data => { // Obtener los datos del cliente
            if (data != null && data != 0) {
              this.listadoBuscado[i].alias_usuario = data[0]['alias_usuario'];
              this.listadoBuscado[i].nif = data[0]['nif_usuario'];
              this.listadoBuscado[i].nombre_usuario = data[0]['nombre_usuario'];
              this.listadoBuscado[i].telefono = data[0]['telefono'];
              this.listadoBuscado[i].email = data[0]['email'];
            }
          });

          let userResenia = new HttpParams()
          .set('opcion', '19')
          .set('idResenia', element['idResenia']);
          this.http.post < any > ("http://34.206.59.221/dashboard.php", userResenia).subscribe(data => { // Obtener los datos del cliente
            if (data != null && data != 0) {
              this.listadoBuscado[i].tipo_alojamiento = data[0]['tipo'].charAt(0).toUpperCase()+data[0]['tipo'].slice(1);
              this.listadoBuscado[i].idAlojamiento = data[0]['idAlojamiento'];
              this.listadoBuscado[i].numeroAlojamiento = data[0]['numeroAlojamiento'];
              if(data[0]['tipo'] == 'bungalow'){
                this.listadoBuscado[i].habitaciones = data[0]['habitaciones'];
                this.listadoBuscado[i].maximo_personas = data[0]['maximo_personas'];
              }else{
                this.listadoBuscado[i].dimension = data[0]['dimension'];
                switch (data[0]['sombra']) {
                  case '0':
                    this.listadoBuscado[i].sombra = "Nada";
                    break;
                  case '1':
                    this.listadoBuscado[i].sombra = "Media";
                    break;

                  case '2':
                    this.listadoBuscado[i].sombra = "Bastante";
                    break;

                  case '3':
                    this.listadoBuscado[i].sombra = 'Mucha';
                    break;

                  default:
                    this.listadoBuscado[i].sombra = "Desconocido";
                    break;
                }
              }
            }
          });
        }
      }
    });
  }

  buscarUsuarios() { // Busca usuarios por el alias del usuario, el DNI o el email
    let alias: any = '0';
    let dni: any = '0';
    let email: any = '0';

    if (this.buscarUsuario.get('alias_usuario').value != null && this.buscarUsuario.get('alias_usuario').value != '' && this.buscarUsuario.get('alias_usuario').value != 0) {
      alias = this.buscarUsuario.get('alias_usuario').value;
    }
    if (this.buscarUsuario.get('dniUsuario').value != null && this.buscarUsuario.get('dniUsuario').value != '' && this.buscarUsuario.get('dniUsuario').value != 0 && !this.buscarReserva.get('dniUsuario').hasError('pattern')) {
      dni = (this.buscarUsuario.get('dniUsuario').value).slice(0,8)+(this.buscarUsuario.get('dniUsuario').value).charAt(8).toUpperCase();
    }
    if (this.buscarUsuario.get('email').value != null && this.buscarUsuario.get('email').value != '') {
      email = this.buscarUsuario.get('email').value;
    }

    let params = new HttpParams()
    .set('opcion', '21')
    .set('alias', alias)
    .set('dniUsuario', dni)
    .set('email', email);
    this.http.post<any>("http://34.206.59.221/dashboard.php", params).subscribe(data => {
      this.buscado = true;
      if (data != null && data != 0) {
        this.listadoBuscado = data;
      }
    });
  }

  atrasBusqueda() { // Función del botón atrás de reservas (parte de búsqueda)
    this.listadoBuscado = [];
    this.buscado = false;
    this.reservaSeleccionada = false;
    if (this.router.snapshot.url.length > 1 && this.router.snapshot.url[0].path == 'dashboard' && this.router.snapshot.url[1].path == 'reservas') {
      this.buscarReserva.get('fechaEntrada').setValue('');
      this.buscarReserva.get('idReserva').setValue('');
      this.buscarReserva.get('dniUsuario').setValue('');
    }else if (this.router.snapshot.url.length > 1 && this.router.snapshot.url[0].path == 'dashboard' && this.router.snapshot.url[1].path == 'resenias') {
      this.buscarResenia.get('idResenia').setValue('');
      this.buscarResenia.get('dniUsuario').setValue('');
      this.buscarResenia.get('idAlojamiento').setValue('');
    }else if (this.router.snapshot.url.length > 1 && this.router.snapshot.url[0].path == 'dashboard' && this.router.snapshot.url[1].path == 'usuarios') {
      this.buscarUsuario.get('alias_usuario').setValue('');
      this.buscarUsuario.get('dniUsuario').setValue('');
      this.buscarUsuario.get('email').setValue('');
    }else if (this.router.snapshot.url.length > 1 && this.router.snapshot.url[0].path == 'dashboard' && this.router.snapshot.url[1].path == 'admin' && this.router.snapshot.url[2].path == 'temporadas' && this.agregarTemporada == true) {
      this.agregarTemporada = false;
    }else if (this.router.snapshot.url.length > 1 && this.router.snapshot.url[0].path == 'dashboard' && this.router.snapshot.url[1].path == 'admin' && this.router.snapshot.url[2].path == 'temporadas') {
      this.dashboardAdminTemporadasEditar = false;
      this.agregarTemporada = false;
    }else if (this.router.snapshot.url.length > 1 && this.router.snapshot.url[0].path == 'dashboard' && this.router.snapshot.url[1].path == 'admin' && this.router.snapshot.url[2].path == 'servicios' && this.dashboardServiciosEditar == true) {
      this.dashboardServiciosEditar = false;
      this.agregarAlojamiento = false;
      this.edicionServicios.reset();
      this.addAlojamientoForm.get('tipo').setValue('');
      this.addAlojamientoForm.get('nombre').setValue('');
      this.addAlojamientoForm.get('precio').setValue('');
      this.addAlojamientoForm.get('sombra').setValue('');
      this.addAlojamientoForm.get('dimension').setValue('');
      this.addAlojamientoForm.get('habitaciones').setValue('');
      this.addAlojamientoForm.get('maximo_personas').setValue('');
    }

    
  }

  editar(r) { // Editar reserva
    this.reservaEditar = null;
    this.serviciosReservaEditar = [];
    this.allServices = [];
    this.reservaEditar = r;
    this.editarReserva.reset();

    // Seteo de fechas por defecto
    let fecha1 = this.reservaEditar.fecha_entrada.split('/');
    let fecha2 = this.reservaEditar.fecha_salida.split('/');

    this.editarReserva.get('fechaEntrada').setValue(new Date(fecha1[2], fecha1[1]-1, fecha1[0]));
    this.editarReserva.get('fechaSalida').setValue(new Date(fecha2[2], fecha2[1]-1, fecha2[0]));

    // Obtención de todos los servicios de la reserva y sus cantidades
    let servicios = new HttpParams()
    .set('opcion', '13')
    .set('idReserva', r.idReserva);
    this.http.post<any>("http://34.206.59.221/dashboard.php", servicios).subscribe(data => {
      if(data != null && data != 0) {
        this.serviciosReservaEditar = data;
        let cantidades = new HttpParams()
        .set('opcion', '14')
        .set('idReserva', r.idReserva);
        this.http.post<any>("http://34.206.59.221/dashboard.php", cantidades).subscribe(data => {
          if(data != null && data != 0) {
            for (let i = 0; i < this.serviciosReservaEditar.length; i++) {
              const element = this.serviciosReservaEditar[i];
              for (let x = 0; x < data.length; x++) {
                const elemento = data[x];
                if(element.idServicio == elemento.idServicio) {
                  this.serviciosReservaEditar[i].cantidad = elemento.cantidad;
                }
              }
            }
          }

          let todosServicios = new HttpParams()
          .set('opcion', '22');
          this.http.post<any>("http://34.206.59.221/dashboard.php", todosServicios).subscribe(data => {
            if(data != null && data != 0) {
              for (let k = 0; k < data.length; k++) {
                const element = data[k];
                if(element.idAlojamiento == null) {
                  this.allServices.push(element);
                }
              }
              for (let z = 0; z < this.serviciosReservaEditar.length; z++) {
                const element = this.serviciosReservaEditar[z];
                for (let j = 0; j < this.allServices.length; j++) {
                  const elemento = this.allServices[j];
                  this.editarReserva.addControl('servicio'+this.allServices[j]['idServicio'], new FormControl(false,[]));
                  this.editarReserva.addControl('num'+this.allServices[j]['idServicio'], new FormControl({value: '', disabled: true},[]));
                  if(element.idServicio == elemento.idServicio) {
                    this.allServices[j].cantidad = element.cantidad;
                    this.editarReserva.get('servicio'+this.allServices[j]['idServicio']).setValue(true);
                    this.editarReserva.get('num'+this.allServices[j]['idServicio']).enable();
                    this.editarReserva.get('num'+this.allServices[j]['idServicio']).setValue(element.cantidad);
                    if(element.idServicio == 2 || element.idServicio == 3 || element.idServicio == 4) {
                      this.editarReserva.get('numePersonasAlojamiento').setValue(2);
                    }if(this.reservaEditar.tipo_alojamiento == 'Parcela') {
                      if(this.reservaEditar.num_personas < 3) {
                        this.editarReserva.get('numePersonasAlojamiento').setValue(this.reservaEditar.num_personas);
                      }
                    }
                  }
                }
              }
            }
          });
        });
      }
    });

    if(this.reservaEditar.tipo_alojamiento == 'Parcela') {
      this.editarReserva.setValidators([this.validacionFecha(),this.maximoPersonas()]);
    }else{
      this.editarReserva.setValidators([this.validacionFecha()]);
    }
    this.reservaSeleccionada = true;
  }

  validacionFecha(){ // Validación de las fechas
    return (): ValidationErrors => {
      if(this.editarReserva.get('fechaSalida').value != ''){
        this.editarReserva.get('fechaSalida').setErrors(null);
        this.fechaVal = false;
        let diff = Math.floor((new Date(this.editarReserva.get('fechaSalida').value).getTime() - new Date(this.editarReserva.get('fechaEntrada').value).getTime())/86400000);
        if (diff <= 0) {
          this.editarReserva.get('fechaSalida').setErrors({fecha2Mayor: true});
        }else if(diff > 0){
          this.editarReserva.get('fechaSalida').setErrors(null);
        } 
      }else{
        this.editarReserva.get('fechaSalida').setErrors({vacio: true});
      }
    return;
  };
}

  onChange(servicio){ // Habilitar el respectivo input del checkbox
    if(this.editarReserva.get('servicio'+servicio.idServicio).value) {
      this.editarReserva.get('num'+servicio.idServicio).enable();
    }else{
      this.editarReserva.get('num'+servicio.idServicio).disable();
      this.editarReserva.get('num'+servicio.idServicio).setValue('');
    }
  }

  maximoPersonas(){ // Validación de las personas
    return (): ValidationErrors => {
      if(this.editarReserva.get('num4')) {
        let adultoExtra = this.editarReserva.get('servicio2').value == true && this.editarReserva.get('num2').value != null && this.editarReserva.get('num2').value > 0 ? this.editarReserva.get('num2').value : 0;
        let menorExtra = this.editarReserva.get('servicio3').value == true && this.editarReserva.get('num3').value != null && this.editarReserva.get('num3').value > 0 ? this.editarReserva.get('num3').value : 0;
        let mayorExtra = this.editarReserva.get('servicio4').value == true && this.editarReserva.get('num4').value != null && this.editarReserva.get('num4').value > 0 ? this.editarReserva.get('num4').value : 0;
        let personasAlojamiento = !null ? this.editarReserva.get('numePersonasAlojamiento').value : 0

        this.totalPersonas = Number(adultoExtra) + Number(menorExtra) + Number(mayorExtra) + Number(personasAlojamiento);
        let total = Number(adultoExtra) + Number(menorExtra) + Number(mayorExtra) + Number(personasAlojamiento);

        if(this.editarReserva.get('numePersonasAlojamiento').value != null && this.editarReserva.get('numePersonasAlojamiento').value > 0 && this.editarReserva.get('numePersonasAlojamiento').value < 3) {
          if(this.editarReserva.get('numePersonasAlojamiento').value == 1 && (this.editarReserva.get('num2').value > 0 || this.editarReserva.get('num3').value > 0 || this.editarReserva.get('num4').value > 0)) {
            this.editarReserva.get('numePersonasAlojamiento').setErrors({'muchaGente': true});
          }else{
            this.editarReserva.get('numePersonasAlojamiento').setErrors(null);
          }
          if(this.editarReserva.get('num2').value != null && this.editarReserva.get('num2').value > 0 && this.editarReserva.get('num2').value < 12) {
            if(this.editarReserva.get('num3').value != null && this.editarReserva.get('num3').value > 0 && this.editarReserva.get('num3').value < 12) {
              if(this.editarReserva.get('num4').value != null && this.editarReserva.get('num4').value > 0 && this.editarReserva.get('num4').value < 12) {
                if(total > 12) {
                  this.editarReserva.get('numePersonasAlojamiento').setErrors({'muchaGente': true});
                }else{
                  this.editarReserva.get('numePersonasAlojamiento').setErrors(null);
                }
              }else{
                this.editarReserva.get('num4').setErrors({'muchaGente': true});
              }
            }else{
              this.editarReserva.get('num3').setErrors({'muchaGente': true});
            }
          }else{
            this.editarReserva.get('num2').setErrors({'muchaGente': true});
          }
        }else{
          this.editarReserva.get('numePersonasAlojamiento').setErrors({'noGente': true});
        }
      }
      return;
    };
  }

  edicionReserva(r) { // Comprobación del formulario y envío de datos al php para guardar en BD si en php valida las fechas, en caso de solo añadir servicios update directamente

    // Comprobación de campos, checkbox activado input relleno, sino no hace la función
    let validado: number = 1;

    if(this.editarReserva.get('numePersonasAlojamiento').value > 2) {
      validado = 0;
    }
    Object.entries(this.editarReserva.value).forEach(entries => {
      if(entries[0] != 'num1' && entries[0] != 'numePersonasAlojamiento' && entries[1] == true){
        let idServicio = String(entries[0]).substring(String(entries[0]).length-1);
        if(idServicio != '1' && this.editarReserva.get('num'+idServicio).value && (this.editarReserva.get('num'+idServicio).value == '' || this.editarReserva.get('num'+idServicio).value < 1)){
          console.log(idServicio+' está mal')
          validado = 0;
        }
      }

      if(entries[0] != 'num1' && entries[1] == true){
        let idServicio = String(entries[0]).substring(String(entries[0]).length-1);
        if(idServicio == '2' || idServicio == '3' || idServicio == '4'){
          if(this.editarReserva.get('numePersonasAlojamiento').value == 1 && this.editarReserva.get('num'+idServicio).value > 0) {
            validado = 0;
          }
        }
      }
    }); 

    // Si formulario está validado se mandan los datos al php y comprueba las fechas y datos
    if(this.reservaEditar.tipo_alojamiento == 'Parcela') {
      if(this.totalPersonas < 0 && this.totalPersonas > 12){
        validado = 0;
      }
    }

    if(validado == 1 ){
      let updateReserva = new HttpParams()
      .set('opcion', '29')
      .set('idReserva', this.reservaEditar.idReserva);

      let insertReserva = new HttpParams()
      .set('opcion', '31')
      .set('idReserva', this.reservaEditar.idReserva);

      let deleteReserva = new HttpParams()
      .set('opcion', '32')
      .set('idReserva', this.reservaEditar.idReserva);;

      let fecha1 = new Date(this.editarReserva.get('fechaEntrada').value);
      let fecha2 = new Date(this.editarReserva.get('fechaSalida').value);

      let insert = 0;
      let update = 0;
      let deletee = 0;

      if(fecha1.toLocaleDateString('es-ES',{day: '2-digit', month: '2-digit', year: 'numeric'}) != this.reservaEditar.fecha_entrada || fecha2.toLocaleDateString('es-ES',{day: '2-digit', month: '2-digit', year: 'numeric'}) != this.reservaEditar.fecha_salida) {
        update = 1;
        updateReserva = updateReserva.set('fechaEntrada', fecha1.getFullYear()+'-'+(fecha1.getMonth()+1)+'-'+fecha1.getDate());
        updateReserva = updateReserva.set('fechaSalida', fecha2.getFullYear()+'-'+(fecha2.getMonth()+1)+'-'+fecha2.getDate());
        console.log('alguna fecha distinta')
      }else{
        console.log('fechas iguales')
      }

      let listaeditarReserva: any = [];
      let listaupdateReserva: any = [];
      let listadeleteReserva: any = [];

      Object.entries(this.editarReserva.value).forEach(entries => {
        if(entries[0] != 'num1'){
          for (let i = 0; i < this.allServices.length; i++) {
            const element = this.allServices[i];
            if(entries[0] == 'servicio'+element['idServicio'] && entries[1] == true){
              let cant = this.editarReserva.get('num'+element['idServicio']).value ? this.editarReserva.get('num'+element['idServicio']).value : 0;
              for (let z = 0; z < this.serviciosReservaEditar.length; z++) {
                const elemento = this.serviciosReservaEditar[z];
                if(element.idServicio == elemento.idServicio && this.editarReserva.get('num'+element.idServicio).value != '0'){
                  if(Number(element.cantidad) == Number(cant)) { // Si la cantidad del servicio extra no se ha actualizado
                    //console.log('igual')
                    break;
                  }else{ // Si la cantidad del servicio extra ha sido actualizada
                    //console.log('actualizado')
                    update = 1;
                    listaupdateReserva.push(element.idServicio,this.editarReserva.get('num'+element.idServicio).value)
                    break;
                  }
                }else if(z == this.serviciosReservaEditar.length-1 && element.idServicio != elemento.idServicio && this.editarReserva.get('num'+element.idServicio).value != '0'){ // Si el servicio extra es nuevo
                  //console.log('nuevo')
                  insert = 1;
                  listaeditarReserva.push(element.idServicio,this.editarReserva.get('num'+element.idServicio).value);
                  break;
                }
              }
              break;
            }else if(entries[0] == 'servicio'+element['idServicio']){
              for (let j = 0; j < this.serviciosReservaEditar.length; j++) {
                const elemento = this.serviciosReservaEditar[j];
                if(element.idServicio == elemento.idServicio && this.editarReserva.get('num'+element.idServicio).value != '0') { // Si se ha eliminado el servicio extra
                  //console.log('deletee')
                  deletee = 1;
                  listadeleteReserva.push(element.idServicio);
                }
              }
            }
          }
        }
      });

      if(deletee) { // Si hay algún servicio extra eliminado
        deleteReserva = deleteReserva.set('servicios', listadeleteReserva);
        this.http.post<any>("http://34.206.59.221/dashboard.php", deleteReserva).subscribe(data => { // Delete
          if(data == null && data == 0) {
            this.errorEdicionReserva = true;
          }
        });
      }
      
      if(update) { // Si hay alguna actualización de servicio extra
        // todo: comprobar que no haya reservas de ese alojamiento en las fechas que se ha introducido, si solo se modifican los servicios, actualizarlos sin más.
        if(listaupdateReserva.length > 0) {
          updateReserva = updateReserva.set('servicios',listaupdateReserva);
        }
        this.http.post<any>("http://34.206.59.221/dashboard.php", updateReserva).subscribe(data => { // Update
          console.log(data)
          if(data == null && data == 0) {
            this.errorEdicionReserva = true;
          }else if(data == 2) {
            // todo: error de fechas
            this.errorEdicionReserva = true;
            this.errorFechas = true;
            console.log(data)
          }else if(data == 3) {
            //todo: error de update
            this.errorEdicionReserva = true;
  
            console.log(data)
          }
        });
      }
      
      if(insert) { // Si hay algún servicio extra nuevo
        insertReserva = insertReserva.set('servicios',listaeditarReserva);
        this.http.post<any>("http://34.206.59.221/dashboard.php", insertReserva).subscribe(data => { // Insert
          if(data == null && data == 0) {
            this.errorEdicionReserva = true;
          }
        });
      }

      // Si todas las operaciones de la edición de reserva han sido satisfactorias, recarga la página
      if(!this.errorEdicionReserva) {
        location.reload();
      }
    }else{
      //console.log('algo va mal')
    }
  }

  eliminar(r) { // Eliminación de reserva
    this.openBottomSheet2(r);
  }

  agregarTemp() { // Cambia la vista para agregar temporada
    this.agregarTemporada = true;
  }

  addTemporada() { // Añadir temporada
    // Si no hay algún campo vacío y cumplen los requisitos (Validators)
    if(this.agregarTemporadas.get('fechaInicio').value != '' && this.agregarTemporadas.get('fechaInicio').value != null) { 
      this.agregarTemporadas.get('fechaInicio').setErrors(null);
    }else {
      this.agregarTemporadas.get('fechaInicio').setErrors({'noFechaInicio': true});
    }
    if(this.agregarTemporadas.get('fechaFin').value != '' && this.agregarTemporadas.get('fechaFin').value != null) {
      this.agregarTemporadas.get('fechaFin').setErrors(null);
    }else{
      this.agregarTemporadas.get('fechaFin').setErrors({'noFechaFin': true});
    }
    if(this.agregarTemporadas.get('nombre').value != '' && this.agregarTemporadas.get('nombre').value != null && !this.agregarTemporadas.get('nombre').hasError('pattern')) {
      this.agregarTemporadas.get('nombre').setErrors(null);
    }else{
      this.agregarTemporadas.get('nombre').setErrors({'noNombre': true});
    }
    if(this.agregarTemporadas.get('multiplicador').value != '' && this.agregarTemporadas.get('multiplicador').value != null) {
      this.agregarTemporadas.get('multiplicador').setErrors(null);
    }else{
      this.agregarTemporadas.get('multiplicador').setErrors({'noMulti': true});
    }

    if(!this.agregarTemporadas.get('fechaInicio').hasError('noFechaInicio') && !this.agregarTemporadas.get('fechaFin').hasError('noFechaFin') && !this.agregarTemporadas.get('nombre').hasError('noNombre') && !this.agregarTemporadas.get('multiplicador').hasError('noMulti')) {
      let tempParams = new HttpParams()
      .set('opcion', '24')
      .set('nombre', this.agregarTemporadas.get('nombre').value)
      .set('fechaInicio', moment(this.agregarTemporadas.get('fechaInicio').value).format('YYYY-MM-DD'))
      .set('fechaFin', moment(this.agregarTemporadas.get('fechaFin').value).format('YYYY-MM-DD'))
      .set('multiplicador', this.agregarTemporadas.get('multiplicador').value)
      .set('insert', '1');

      this.http.post<any>("http://34.206.59.221/dashboard.php", tempParams).subscribe(data => {
        if(data != null && data != 0) {
          location.reload();
        }else{
          this.errorTemp = true;
        }
      });
    }
  }

  eliminarTemporada (nombre) { // Eliminar temporada, abre popup
    this.openBottomSheet(nombre);
  }

  editarTemporada(nombre, fechaInicio) { // Editar temporada, rellenado del formulario
    this.errorTemp = false;
    this.temporadaEditar = null;
    this.dashboardAdminTemporadasEditar = true;
    for (let i = 0; i < this.listadoTemporadas.length; i++) {
      const element = this.listadoTemporadas[i];
      if (element.nombre_temporada == nombre && element.fecha_entrada == fechaInicio) {
        this.nombreTemp = nombre;
        this.fecha1Temp = fechaInicio;
        this.fecha2Temp = element.fecha_salida;
        this.multiplicativoTemp = element.multiplicador;
        this.temporadaEditar = element;
      }
    }
    this.edicionTemporada.get('nombre').setValue(this.temporadaEditar.nombre_temporada);
    this.edicionTemporada.get('fechaInicio').setValue(this.temporadaEditar.fecha_entrada);
    this.edicionTemporada.get('fechaFin').setValue(this.temporadaEditar.fecha_salida);
    this.edicionTemporada.get('multiplicador').setValue(this.temporadaEditar.multiplicador);
  }

  guardarTemporada() { // Guardar temporada BD
    let nombre = this.edicionTemporada.get('nombre').value;
    let fechaInicio = moment(this.edicionTemporada.get('fechaInicio').value);
    let fechaFin = moment(this.edicionTemporada.get('fechaFin').value);
    let multiplicador = this.edicionTemporada.get('multiplicador').value;

    let tempParams = new HttpParams()
    .set('opcion', '24')
    .set('nombre', nombre)
    .set('fechaInicio', fechaInicio.format('YYYY-MM-DD'))
    .set('fechaFin', fechaFin.format('YYYY-MM-DD'))
    .set('multiplicador', multiplicador)
    .set('antiguoNombre', this.nombreTemp)
    .set('antiguoFecha1', this.fecha1Temp)
    .set('antiguoFecha2', this.fecha2Temp)
    .set('antiguoMultiplicativo', this.multiplicativoTemp)
    .set('update', '1');

    this.http.post<any>("http://34.206.59.221/dashboard.php", tempParams).subscribe(data => {
      if(data != null && data != 0) {
        location.reload();
      }else{
        this.errorTemp = true;
      }
    });
  }

  editarServicio(servicio) { // Editar servicio, rellenado del formulario
    this.dashboardServiciosEditar = true;
    this.edicionServicios.get('idServicio').setValue(servicio.idServicio);
    this.edicionServicios.get('nombre').setValue(servicio.nombre);
    this.edicionServicios.get('precio').setValue(servicio.precio);
    if(servicio.idAlojamiento != null) {
      let alojamiento = new HttpParams()
      .set('opcion', '12')
      .set('idAlojamiento', servicio.idAlojamiento);

      this.http.post<any>("http://34.206.59.221/dashboard.php", alojamiento).subscribe(data =>{ // Obtener las entradas al camping del día
        if(data != null && data != 0){
          this.servicioEditar = data[0];
          this.servicioAlojamiento = true;
          this.edicionServicios.get('idAlojamiento').setValue(this.servicioEditar.idAlojamiento);
        }
      });
    }else{
      this.servicioAlojamiento = false;
      this.edicionServicios.get('idAlojamiento').setValue('');
    }
  }

  eliminarServicio(servicio) { // Muestra el popup para confirmar la eliminación del servicio a eliminar
    this.openBottomSheet3(servicio);
  }

  guardarServicio() { // Guardar servicio en BD (Editar)
    this.errorGuardarServicio = false;
    if(this.edicionServicios.get('nombre').value != null && this.edicionServicios.get('nombre').value != '') {
      this.edicionServicios.setErrors({'noNombre': true});
    }else{
      this.edicionServicios.setErrors(null);
    }
    if(this.edicionServicios.get('precio').value != null && this.edicionServicios.get('precio').value != '' && this.edicionServicios.get('precio').value != 0) {
      this.edicionServicios.setErrors({'noPrecio': true});
    }else{
      this.edicionServicios.setErrors(null);
    }

    let servicio = new HttpParams()
      .set('opcion', '26')
      .set('nombre', this.edicionServicios.get('nombre').value)
      .set('precio', this.edicionServicios.get('precio').value)
      .set('idServicio', this.edicionServicios.get('idServicio').value);

    this.http.post<any>("http://34.206.59.221/dashboard.php", servicio).subscribe(data =>{ // Obtener las entradas al camping del día
      if(data != null && data != 0){
        location.reload();
      }else{
        this.errorGuardarServicio = true;
      }
    });
  }

  addAlojamiento() { // Cambia la vista para agregar alojamiento
    this.dashboardServiciosEditar = true;
    this.agregarAlojamiento = true;
  }

  guardarAlojamiento() { // Guarda el alojamiento en la BD
    if(this.addAlojamientoForm.get('nombre').value != null && this.addAlojamientoForm.get('nombre').value != '') {
      this.addAlojamientoForm.get('nombre').setErrors(null);
    }else{
      this.addAlojamientoForm.get('nombre').setErrors({'noNombre': true});
    }
    if(this.addAlojamientoForm.get('precio').value != null && this.addAlojamientoForm.get('precio').value != '' && this.addAlojamientoForm.get('precio').value != 0) {
      this.addAlojamientoForm.get('precio').setErrors(null);
    }else{
      this.addAlojamientoForm.get('precio').setErrors({'noPrecio': true});
    }
    if(this.addAlojamientoForm.get('tipo').value != null && this.addAlojamientoForm.get('tipo').value != '') {
      this.addAlojamientoForm.get('tipo').setErrors(null);
    }else{
      this.addAlojamientoForm.get('tipo').setErrors({'noTipo': true});
    }

    if(this.addAlojamientoForm.get('tipo').value != null && this.addAlojamientoForm.get('tipo').value != '' && this.addAlojamientoForm.get('tipo').value == 'parcela') {

      if(this.addAlojamientoForm.get('sombra').value != null && this.addAlojamientoForm.get('sombra').value != '') {
        this.addAlojamientoForm.get('sombra').setErrors(null);
      }else{
        this.addAlojamientoForm.get('sombra').setErrors({'noSombra': true});
      }
      if(this.addAlojamientoForm.get('dimension').value != null && this.addAlojamientoForm.get('dimension').value != '') {
        this.addAlojamientoForm.get('dimension').setErrors(null);
      }else{
        this.addAlojamientoForm.get('dimension').setErrors({'noDimension': true});
      }
    }else if (this.addAlojamientoForm.get('tipo').value != null && this.addAlojamientoForm.get('tipo').value != '' && this.addAlojamientoForm.get('tipo').value == 'bungalow') {

      if(this.addAlojamientoForm.get('habitaciones').value != null && this.addAlojamientoForm.get('habitaciones').value != '' && this.addAlojamientoForm.get('habitaciones').value != 0) {
        this.addAlojamientoForm.get('habitaciones').setErrors(null);
      }else{
        this.addAlojamientoForm.get('habitaciones').setErrors({'noHabitaciones': true});
      }
      if(this.addAlojamientoForm.get('maximo_personas').value != null && this.addAlojamientoForm.get('maximo_personas').value != '' && this.addAlojamientoForm.get('maximo_personas').value != 0) {
        this.addAlojamientoForm.get('maximo_personas').setErrors(null);
      }else{
        this.addAlojamientoForm.get('dimension').setErrors({'noMaximo': true});
      }
    }

    let ok = false;
    if(!this.addAlojamientoForm.get('nombre').hasError('noNombre') && !this.addAlojamientoForm.get('precio').hasError('noPrecio') && !this.addAlojamientoForm.get('tipo').hasError('noTipo') ){
      if(this.addAlojamientoForm.get('tipo').value == 'parcela' && !this.addAlojamientoForm.get('sombra').hasError('noSombra') && !this.addAlojamientoForm.get('dimension').hasError('noDimension')){
        ok = true;
      }else if(this.addAlojamientoForm.get('tipo').value == 'bungalow' && !this.addAlojamientoForm.get('habitaciones').hasError('noHabitaciones') && !this.addAlojamientoForm.get('maximo_personas').hasError('noMaximo')){
        ok = true;
      }
    }

    if(ok) {
      let insertAlojamiento = new HttpParams()
      .set('opcion', '27')
      .set('nombre', this.addAlojamientoForm.get('nombre').value)
      .set('precio', this.addAlojamientoForm.get('precio').value)
      .set('tipo', this.addAlojamientoForm.get('tipo').value);
      if(this.addAlojamientoForm.get('tipo').value == 'parcela') {
        insertAlojamiento = insertAlojamiento.set('sombra', this.addAlojamientoForm.get('sombra').value);
        insertAlojamiento = insertAlojamiento.set('dimension', this.addAlojamientoForm.get('dimension').value);
      }else{
        insertAlojamiento = insertAlojamiento.set('habitaciones', this.addAlojamientoForm.get('habitaciones').value);
        insertAlojamiento = insertAlojamiento.set('maximo_personas', this.addAlojamientoForm.get('maximo_personas').value);
      }

      this.http.post<any>("http://34.206.59.221/dashboard.php", insertAlojamiento).subscribe(data =>{ // Obtener las entradas al camping del día
      if(data != null && data != 0){
        location.reload();
      }else{
        this.errorAgregarAlojamiento = true;
      }
    });
    }
  }

  addServicio() {
    this.dashboardServiciosEditar = true;
  }

  suma(a,b){
    return parseFloat(a)+parseFloat(b);
  }


  ngOnInit(): void {
    this.scrollToBottom();
    if(localStorage.getItem('usuarioActual') != null){ // Comprobación de que tiene autorización para entrar a la administración
      this.usuarioActual = desencriptar(localStorage.getItem('usuarioActual'));
      if(this.usuarioActual['rol'] == 'cliente'){
        window.location.href = 'http://34.206.59.221:4200/';
      }else{
        this.trabajador = true;
      }
    }else{
      window.location.href = 'http://34.206.59.221:4200/';
    }

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
      this.dashboardAdminTemporadas = false;
      this.dashboardAdminServicios = false;

      this.atrasBusqueda();

      // Entradas hoy
      let entrada = new HttpParams()
      .set('opcion', '1');

      this.http.post<any>("http://34.206.59.221/dashboard.php", entrada).subscribe(data =>{ // Obtener las entradas al camping del día
        if(data != null){
          this.reservasHoy = data[0]['COUNT(*)'];
        }
      });
      
      // Salidas hoy
      let salida = new HttpParams()
      .set('opcion', '2');

      this.http.post<any>("http://34.206.59.221/dashboard.php", salida).subscribe(data =>{ // Obtener las salidas del camping del día
        if(data != null){
          this.reservasHoySalidas = data[0]['COUNT(*)'];
        }
      });

      // Reseñas por revisar
      let resenias = new HttpParams()
      .set('opcion', '3');

      this.http.post<any>("http://34.206.59.221/dashboard.php", resenias).subscribe(data =>{ // Obtener las reseñas que está por ser publicadas
        if(data != null){
          this.revisarResenias = data[0]['COUNT(*)'];
        }
      });

      // Últimas 10 reservas
      let reservas = new HttpParams()
      .set('opcion', '4');

      this.http.post<any>("http://34.206.59.221/dashboard.php", reservas).subscribe(data =>{ // Obtener las últimas 10 reservas
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
      this.dashboardAdminTemporadas = false;
      this.dashboardAdminServicios = false;

      this.atrasBusqueda();

      let reseniasAprobar = new HttpParams()
      .set('opcion', '5');

      this.http.post < any > ("http://34.206.59.221/dashboard.php", reseniasAprobar).subscribe(data => { // Obtener las reseñas que están por ser aprobadas para ser publicadas
        if (data!= null && data != 0) {
          this.listadoResenias = data;
          this.listadoReseniasAlgo = false;

          for (let i = 0; i < this.listadoResenias.length; i++) {
            const element = this.listadoResenias[i];

            let nombreUser = new HttpParams()
              .set('opcion', '6')
              .set('idUsuario', element['idUsuario']);

            this.http.post < any > ("http://34.206.59.221/dashboard.php", nombreUser).subscribe(data => { // Obtener los nombres de todas las reseñas por aprobar
              if (data != null && data != 0) {
                this.listadoResenias[i].alias_usuario = data[0]['alias_usuario'];
              }
            });

            let idAlojamientoResenia = new HttpParams()
              .set('opcion', '7')
              .set('idResenia', element['idResenia']);

            this.http.post < any > ("http://34.206.59.221/dashboard.php", idAlojamientoResenia).subscribe(data => { // Obtener el idAlojamiento de todas las reseñas por aprobar
              if (data != null && data != 0) {
                this.listadoResenias[i].idAlojamiento = data[0]['idAlojamiento'];
              }
            });
          }
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
      this.dashboardAdminTemporadas = false;
      this.dashboardAdminServicios = false;

      this.atrasBusqueda();

      /**
       * ! Aquí va el código de SALIDAS HOY, CUADRADO CENTRAL DE INICIO
       */

      let salidasHoy = new HttpParams()
      .set('opcion', '10');
      this.http.post < any > ("http://34.206.59.221/dashboard.php", salidasHoy).subscribe(data => { // Obtener las reservas que saldrán hoy
        if (data != null && data != 0) {
          this.listadoSalidasHoy = data;
          for (let i = 0; i < this.listadoSalidasHoy.length; i++) {
            const element = this.listadoSalidasHoy[i];

            this.serviciosExtras = [];
            this.totalPagar = 0;

            // Total de días de la reserva
            let dias = Math.floor((new Date(this.listadoSalidasHoy[i].fecha_salida).getTime() - new Date(this.listadoSalidasHoy[i].fecha_entrada).getTime())/86400000);

            let nombreUser = new HttpParams()
            .set('opcion', '6')
            .set('idUsuario', element['idUsuario']);
            this.http.post < any > ("http://34.206.59.221/dashboard.php", nombreUser).subscribe(data => { // Obtener los datos del cliente
              if (data != null && data != 0) {
                this.listadoSalidasHoy[i].alias_usuario = data[0]['alias_usuario'];
                this.listadoSalidasHoy[i].nif = data[0]['nif_usuario'];
                this.listadoSalidasHoy[i].nombre_usuario = data[0]['nombre_usuario'];
                this.listadoSalidasHoy[i].telefono = data[0]['telefono'];
                this.listadoSalidasHoy[i].email = data[0]['email'];
                this.listadoSalidasHoy[i].fecha_entrada = new Date(this.listadoSalidasHoy[i].fecha_entrada).toLocaleDateString("es-ES",{year: "numeric", month:"2-digit", day: "2-digit"});
                this.listadoSalidasHoy[i].fecha_salida = new Date(this.listadoSalidasHoy[i].fecha_salida).toLocaleDateString("es-ES",{year: "numeric", month:"2-digit", day: "2-digit"});

                let idAlojamientoSalidasHoy = new HttpParams()
                .set('opcion', '11')
                .set('idReserva', element['idReserva']);
                this.http.post <any>("http://34.206.59.221/dashboard.php", idAlojamientoSalidasHoy).subscribe(data => { // Obtener los datos de los alojamientos de la reserva
                  if (data != null && data != 0) {
                    this.listadoSalidasHoy[i].tipo_alojamiento = data[0]['nombre'];
                    this.listadoSalidasHoy[i].idAlojamiento = data[0]['idAlojamiento'];
                    this.listadoSalidasHoy[i].precioAlojamiento = data[0]['precio'];

                    this.totalPagar = (parseFloat(this.listadoSalidasHoy[i].precioAlojamiento)*dias)*(parseFloat(this.listadoSalidasHoy[i].multiplicativo));
                    
                    let numeAlojamiento = new HttpParams()
                    .set('opcion', '12')
                    .set('idAlojamiento', data[0]['idAlojamiento']);
                    this.http.post < any > ("http://34.206.59.221/dashboard.php", numeAlojamiento).subscribe(data => { // Obtener el número del alojamiento
                      if (data != null && data != 0) {
                        this.listadoSalidasHoy[i].numeroAlojamiento = data[0]['numeroAlojamiento'];
                        if(data[0]['tipo'] == 'bungalow'){
                          this.listadoSalidasHoy[i].habitaciones = data[0]['habitaciones'];
                          this.listadoSalidasHoy[i].maximo_personas = data[0]['maximo_personas'];
                        }else{
                          this.listadoSalidasHoy[i].dimension = data[0]['dimension'];
                          switch (data[0]['sombra']) { // Sombra de la parcela
                            case '0':
                              this.listadoSalidasHoy[i].sombra = "Nada";
                              break;
                            case '1':
                              this.listadoSalidasHoy[i].sombra = "Media";
                              break;
                            case '2':
                              this.listadoSalidasHoy[i].sombra = "Bastante";
                              break;
                            case '3':
                              this.listadoSalidasHoy[i].sombra = 'Mucha';
                              break;
                            default:
                              this.listadoSalidasHoy[i].sombra = "Desconocido";
                              break;
                          }
                        }
                      }
                    });

                    let cantidadFinal: any;
                    let cantidadServicios = new HttpParams()
                    .set('opcion', '14')
                    .set('idReserva', element['idReserva']);
                    
                    this.http.post<any>("http://34.206.59.221/dashboard.php", cantidadServicios).subscribe(data => { // Obtener la cantidad de servicios contratados
                      if (data != null && data != 0) {
                        cantidadFinal = data;
                      }
                    });

                    let serviciosReserva: any = [];
                    let servicios = new HttpParams()
                    .set('opcion', '13')
                    .set('idReserva', element['idReserva']);
                    this.http.post < any > ("http://34.206.59.221/dashboard.php", servicios).subscribe(data => { // Obtener los datos de los servicios contratados
                      if (data != null && data != 0) {
                        serviciosReserva = data;
                        this.pago = 0;
                        for (let x = 0; x < cantidadFinal?.length; x++) {
                          const elemento1 = cantidadFinal[x];
                          for (let r = 0; r < serviciosReserva.length; r++) {
                            const elemento2 = serviciosReserva[r];
                            if(elemento1.idServicio === elemento2.idServicio) {
                              elemento2.cantidad = elemento1.cantidad;
                              //elemento2.precioTotal = elemento2.cantidad*elemento2.precio;
                              this.pago += (elemento2.cantidad*elemento2.precio);
                              this.serviciosExtras.push(elemento2);
                              if(r == serviciosReserva.length-1){
                                this.serviciosExtras.push(this.pago);
                              }
                            }
                          }
                        }
                        this.listadoSalidasHoy[i].servicios = this.serviciosExtras;
                        this.serviciosExtras = [];
                      }
                    });
                    this.listadoSalidasHoy[i].total_pagar = this.totalPagar.toFixed(2);
                  }
                });
              }
            });
          }
        }
      });

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
      this.dashboardAdminTemporadas = false;
      this.dashboardAdminServicios = false;

      this.atrasBusqueda();

      /**
       * ! Aquí va el código de ENTRADAS HOY, CUADRADO IZQUIERDO DE INICIO
       */

      let entradasHoy = new HttpParams()
      .set('opcion', '15');

      this.http.post < any > ("http://34.206.59.221/dashboard.php", entradasHoy).subscribe(data => { // Obtener las reservas que saldrán hoy
        if (data != null && data != 0) {
          this.listadoEntradasHoy = data;
          for (let i = 0; i < this.listadoEntradasHoy.length; i++) {
            const element = this.listadoEntradasHoy[i];
            this.serviciosExtras = [];

            let nombreUser = new HttpParams()
            .set('opcion', '6')
            .set('idUsuario', element['idUsuario']);
            this.http.post < any > ("http://34.206.59.221/dashboard.php", nombreUser).subscribe(data => { // Obtener los datos del cliente
              if (data != null && data != 0) {
                this.listadoEntradasHoy[i].alias_usuario = data[0]['alias_usuario'];
                this.listadoEntradasHoy[i].nif = data[0]['nif_usuario'];
                this.listadoEntradasHoy[i].nombre_usuario = data[0]['nombre_usuario'];
                this.listadoEntradasHoy[i].telefono = data[0]['telefono'];
                this.listadoEntradasHoy[i].email = data[0]['email'];
                this.listadoEntradasHoy[i].fecha_entrada = new Date(this.listadoEntradasHoy[i].fecha_entrada).toLocaleDateString("es-ES",{year: "numeric", month:"2-digit", day: "2-digit"});
                this.listadoEntradasHoy[i].fecha_salida = new Date(this.listadoEntradasHoy[i].fecha_salida).toLocaleDateString("es-ES",{year: "numeric", month:"2-digit", day: "2-digit"});
              }
            });

            let idAlojamientoSalidasHoy = new HttpParams()
            .set('opcion', '11')
            .set('idReserva', element['idReserva']);
            this.http.post < any > ("http://34.206.59.221/dashboard.php", idAlojamientoSalidasHoy).subscribe(data => { // Obtener los datos de los alojamientos de la reserva
              if (data != null && data != 0) {
                this.listadoEntradasHoy[i].tipo_alojamiento = data[0]['nombre'];
                this.listadoEntradasHoy[i].idAlojamiento = data[0]['idAlojamiento'];
                this.listadoEntradasHoy[i].precioAlojamiento = data[0]['precio'];

                let numeAlojamiento = new HttpParams()
                .set('opcion', '12')
                .set('idAlojamiento', data[0]['idAlojamiento']);
                this.http.post < any > ("http://34.206.59.221/dashboard.php", numeAlojamiento).subscribe(data => { // Obtener el número del alojamiento
                  if (data != null && data != 0) {
                    this.listadoEntradasHoy[i].numeroAlojamiento = data[0]['numeroAlojamiento'];
                    if(data[0]['tipo'] == 'bungalow'){
                      this.listadoEntradasHoy[i].habitaciones = data[0]['habitaciones'];
                      this.listadoEntradasHoy[i].maximo_personas = data[0]['maximo_personas'];
                    }else{
                      this.listadoEntradasHoy[i].dimension = data[0]['dimension'];
                      switch (data[0]['sombra']) { // Sombra de la parcela
                        case '0':
                          this.listadoEntradasHoy[i].sombra = "Nada";
                          break;
                        case '1':
                          this.listadoEntradasHoy[i].sombra = "Media";
                          break;
                        case '2':
                          this.listadoEntradasHoy[i].sombra = "Bastante";
                          break;
                        case '3':
                          this.listadoEntradasHoy[i].sombra = 'Mucha';
                          break;
                        default:
                          this.listadoEntradasHoy[i].sombra = "Desconocido";
                          break;
                      }
                    }
                  }
                });
              }
            });

            let servicios = new HttpParams()
            .set('opcion', '13')
            .set('idReserva', element['idReserva']);
            this.http.post<any>("http://34.206.59.221/dashboard.php", servicios).subscribe(data => { // Obtener los datos de los servicios contratados
              if (data != null && data != 0) {
                for (let i = 0; i < data.length; i++) {
                  const element = data[i];
                  delete element.idAlojamiento;
                  this.serviciosExtras.push(element);
                }
                this.serviciosExtras.idReserva = element['idReserva'];
              }
            });
          }
        }
      });

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
      this.dashboardAdminTemporadas = false;
      this.dashboardAdminServicios = false;

      this.atrasBusqueda();

      /**
       * ! Aquí va el código de RESERVAS, AQUÍ SE PODRÁ BUSCAR, VER, EDITAR O ELIMINAR RESERVAS
       */

      let reservas = new HttpParams()
      .set('opcion', '4');

      this.http.post<any>("http://34.206.59.221/dashboard.php", reservas).subscribe(data => {
        if(data != null && data != 0){
          this.reservasList = data;
        }
      });

      /**
        * ? Acaba aquí
        */

    }else if (this.router.snapshot.url.length > 1 && this.router.snapshot.url[0].path == 'dashboard' && this.router.snapshot.url[1].path == 'resenias') {
      // Ver, buscar reseñas

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
      this.dashboardAdminTemporadas = false;
      this.dashboardAdminServicios = false;

      this.atrasBusqueda();

      /**
       * ! Aquí va el código de RESEÑAS, AQUÍ SE PODRÁ BUSCAR Y VER RESEÑAS
       */

      let reseniasBuscar = new HttpParams()
      .set('opcion', '17');

      this.http.post<any>("http://34.206.59.221/dashboard.php", reseniasBuscar).subscribe(data => { // Últimas 10 reseñas
        if(data != null && data != 0){
          this.reseniasList = data;
          for (let k = 0; k < this.reseniasList.length; k++) {
            const element = this.reseniasList[k];
            /**
             * TODO: ¿Mostrar también el nombre de los usuarios anónimos?
             * TODO: Sino se quiere mostrar...
             * if (element.anonimo != 0) { params y POST a la BD }
             */
            let usuarioResenia = new HttpParams()
            .set('opcion', '6')
            .set('idUsuario', element.idUsuario);

            this.http.post<any>("http://34.206.59.221/dashboard.php", usuarioResenia).subscribe(data => { // Datos de usuario de cada reseña
              if(data != null && data != 0) {
                this.reseniasList[k].nombre_usuario = data[0]['nombre_usuario'];
                this.reseniasList[k].nif_usuario = data[0]['nif_usuario'];
              }
            });
          }
        }
      });

       /**
        * ? Acaba aquí
        */

    }else if (this.router.snapshot.url.length > 1 && this.router.snapshot.url[0].path == 'dashboard' && this.router.snapshot.url[1].path == 'usuarios') {
      // Ver, buscar, eliminar usuarios

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
      this.dashboardAdminTemporadas = false;
      this.dashboardAdminServicios = false;

      this.atrasBusqueda();

      /**
       * ! Aquí va el código de USUARIOS, AQUÍ SE PODRÁ BUSCAR, VER, ELIMINAR USUARIOS, pero NO la contraseña, como en el Panel de Control
       */

      let usuariosDatos = new HttpParams()
      .set('opcion', '20');
      this.http.post<any>("http://34.206.59.221/dashboard.php", usuariosDatos).subscribe(data => {
        if (data != null && data != 0) {
          this.listadoUsuarios = data;
        }
      });

       /**
        * ? Acaba aquí
        */

    }else if (this.router.snapshot.url.length > 1 && this.router.snapshot.url[0].path == 'dashboard' && this.router.snapshot.url[1].path == 'servicios') {
      // Aquí sólo se podrán VER los servicios

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
      this.dashboardAdminTemporadas = false;
      this.dashboardAdminServicios = false;

      this.atrasBusqueda();

      /**
       * ! Aquí va el código de SERVICIOS, AQUÍ SE PODRÁ BUSCAR, VER, Y AÑADIR SERVICIOS, pero NO eliminarlos
       */

      let todosServicios = new HttpParams()
      .set('opcion', '22');

      this.http.post<any>("http://34.206.59.221/dashboard.php", todosServicios).subscribe(data => {
        if(data != null && data != 0) {
          this.listadoServicios = data;
          for (let i = 0; i < this.listadoServicios.length; i++) {
            const element = this.listadoServicios[i];
            if(element['idAlojamiento'] != null){

              let datosAlojamiento = new HttpParams()
              .set('opcion', '12')
              .set('idAlojamiento', element['idAlojamiento']);

              this.http.post<any>("http://34.206.59.221/dashboard.php", datosAlojamiento).subscribe(data => {
                if(data != null && data != 0) {
                  if (data[0]['tipo'] == 'parcela') {
                    switch (data[0]['sombra']) { // Sombra de la parcela
                      case '0':
                        this.listadoServicios[i].sombra = "Nada";
                        break;
                      case '1':
                        this.listadoServicios[i].sombra = "Media";
                        break;
                      case '2':
                        this.listadoServicios[i].sombra = "Bastante";
                        break;
                      case '3':
                        this.listadoServicios[i].sombra = 'Mucha';
                        break;
                      default:
                        this.listadoServicios[i].sombra = "Desconocido";
                        break;
                    }
                    this.listadoServicios[i].dimension = data[0]['dimension'];
                  }else{
                    this.listadoServicios[i].habitaciones = data[0]['habitaciones'];
                    this.listadoServicios[i].maximo_personas = data[0]['maximo_personas'];
                  }
                  this.listadoServicios[i].numeroAlojamiento = data[0]['numeroAlojamiento']
                }
              });
            }
          }
        }
      });

       /**
        * ? Acaba aquí
        */

    }else if (this.router.snapshot.url.length > 1 && this.router.snapshot.url[0].path == 'dashboard' && this.router.snapshot.url[1].path == 'admin' && this.router.snapshot.url[2].path == 'temporadas') {
      // Aquí se podrá ver todas las temporadas ya que no son muchas, añadir, editar o eliminar alguna.

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
      this.dashboardServicios = false;
      this.dashboardAdmin = true;
      this.dashboardAdminTemporadas = true;
      this.dashboardAdminServicios = false;

      /**
       * ! Aquí va el código de temporadas
       */

      let temporadas = new HttpParams()
      .set('opcion', '23');

      this.http.post<any>("http://34.206.59.221/dashboard.php", temporadas).subscribe(data => {
        if(data != null && data != 0) {
          this.listadoTemporadas = data;
        }
      });

       /**
        * ? Acaba aquí
        */

    }else if (this.router.snapshot.url.length > 1 && this.router.snapshot.url[0].path == 'dashboard' && this.router.snapshot.url[1].path == 'admin' && this.router.snapshot.url[2].path == 'servicios') {
      // Aquí sólo se podrán VER los servicios, añadir o editar servicios NUNCA ELIMINAR, YA QUE PUEDE DAR ERRORES EN LA PARTE DE RESERVA

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
      this.dashboardServicios = false;
      this.dashboardAdmin = true;
      this.dashboardAdminTemporadas = false;
      this.dashboardAdminServicios = true;

      /**
       * ! Aquí va el código de servicios
       */

      let todosServicios = new HttpParams()
      .set('opcion', '22');

      this.http.post<any>("http://34.206.59.221/dashboard.php", todosServicios).subscribe(data => {
        if(data != null && data != 0) {
          this.listadoServicios = data;
        }
      });

       /**
        * ? Acaba aquí
        */
    }
  }
}

/**
 * ? POPUP para confirmar eliminación de temporada
 */
@Component({
  selector: 'confirmacion',
  templateUrl: 'dashboard.component.confirmacion.html',
})
export class confirmacion {
  constructor(private _popUp: MatBottomSheetRef<confirmacion>, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private http: HttpClient) {}

  confirmado(e) {
    this._popUp.dismiss();
    let temporadas = new HttpParams()
    .set('opcion', '25')
    .set('nombre', e);

    this.http.post<any>("http://34.206.59.221/dashboard.php", temporadas).subscribe(data => {
      if(data != null && data != 0) {
        location.reload();
      }
    });
  }

  cancelar() {
    this._popUp.dismiss();
  }
}

/**
 * ? POPUP para confirmar eliminación de reserva
 */
@Component({
  selector: 'confirmacionReserva',
  templateUrl: 'dashboard.component.confirmacionReserva.html',
})
export class confirmacionReserva {
  constructor(private _popUp: MatBottomSheetRef<confirmacionReserva>, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private http: HttpClient) {}

  confirmadoReserva(e) {
    this._popUp.dismiss();
    let reserva = new HttpParams()
    .set('opcion', '28')
    .set('idReserva', e);

    this.http.post<any>("http://34.206.59.221/dashboard.php", reserva).subscribe(data => {
      if(data != null && data != 0) {
        location.reload();
      }
    });
  }

  cancelar() {
    this._popUp.dismiss();
  }
}

/**
 * ? POPUP para confirmar eliminación de servicio (alojamiento)
 */
@Component({
  selector: 'confirmacionServicio',
  templateUrl: 'dashboard.component.confirmacionServicio.html',
})
export class confirmacionServicio {
  constructor(private _popUp: MatBottomSheetRef<confirmacionServicio>, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private http: HttpClient) {}

  confirmadoServicio(e) {
    this._popUp.dismiss();

    let alojamiento = new HttpParams()
    .set('opcion', '30')
    .set('idAlojamiento', e);

    this.http.post<any>("http://34.206.59.221/dashboard.php", alojamiento).subscribe(data => {
      if(data != null && data != 0) {
        location.reload();
      }
    });
  }

  cancelar() {
    this._popUp.dismiss();
  }
}