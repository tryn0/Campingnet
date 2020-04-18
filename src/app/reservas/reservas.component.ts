import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';

import { DateAdapter } from '@angular/material/core';
import * as moment from 'moment';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css'],
  
})
export class ReservasComponent implements OnInit {

  // Variable de sesión iniciada
  public usuarioActual: string;


  // Variables del formulario 1
  public fechas: FormGroup;
  public fecha1: Date;
  public fecha2: Date;
  public alojamientosDisponibles: any;
  public info1: boolean = false;
  public fechaVal: boolean = false;


  // Variables del formulario 2
  public alojamiento: FormGroup;
  public tipos: string;
  public tipos2: any = [];
  public tipos22: any = [];
  public dato1: string;
  public dato2: string = 'Sombra o habitaciones';
  public arrayCaract1: any = [];
  public dato3: string;
  public dato4: string = 'Dimensión o Número maximo de personas';
  public arrayCaract2: any = [];
  

  // Variables del formulario 3
  public usuario: FormGroup;


  // Variables del formulario 4
  public serviciosExtras: FormGroup;
  public servicios: any = [];
  public electricidad: boolean = null;
  

  constructor(private fb: FormBuilder, private http: HttpClient, private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('es-ES');

    

    

    
    
  }
  // FALTA:

  // CONTROLAR EL TEMA DE HACER RESERVA SIN TENER SESIÓN INICIADA, QUÉ SE GUARDA EN PASSWORD Y ALIAS?

  // UNA VEZ HA ACABADO DE HACER LA RESERVA, CONSULTAR TODOS LOS DATOS A LA BASE DE DATOS, CALCULAR EL MULTIPLICATIVO POR EL TEMA DE LA TEMPORADA
  // EL PRECIO POR EL AOJAMIENTO Y EL PRECIO POR LOS SERVICIOS EXTRAS
  // LUEGO MULTIPLICAR EL MULTIPLICATIVO POR EL PRECIO DEL ALOJAMIENTO Y SUMARLE A ESTE TODOS LOS SERVICIOS EXTRAS
  // MOSTRAR EL PRECIO DE CADA COSA Y ABAJO DE LTODO LA SUMA TOTAL, EN EL CASO DEL ALOJAMIENTO MOSTRARLO CON EL MULTIPLICATIVO DESGLOSADO

  // Mostrar o escondes (toggle) el mensaje de info del formulario de las fechas
  mostrarInfo1(){
    if(this.info1 == false){
      this.info1 = true;
    }else{
      this.info1 = false;
    }
  }

  guardarFechas(){ // Obtiene listado de alojamientos si las fechas introducidas están correctas
    this.fechaVal = true;
    if(this.fechas.get('fechaEntrada').value != '' && this.fechas.get('fechaSalida').value != '' && !this.fechas.get('fechaEntrada').errors && !this.fechas.get('fechaSalida').errors){
      this.tipos2 = [];
      this.tipos22 = [];

      // Parámetros a enviar al archivo PHP
      let params2 = new HttpParams()
      .set('opcion', '2');

      // Petición POST para obtener todos los tipos de alojamieto, FORMULARIO 1, Tipo de alojamiento
      this.http.post('http://localhost/reserva.php', params2).subscribe(data =>{
        if(data != null){ // Si recibe algún alojamiento
          this.tipos2 = data;
          for (let i = 0; i < this.tipos2.length; i++) {
            const element = this.tipos2[i];
            let element2 = element['tipo'][0].toUpperCase()+element['tipo'].slice(1);
            this.tipos22.push(element2);
          }
        }
      }, error => console.log(error));
    }
  }

  getCaracteristica1(datos: string){ // Al escoger un tipo de alojamiento consulta en la BD la característica 1 de todos los alojamientos de ese tipo que estén disponibles entre las fechas indicadas al principio
    this.arrayCaract2 = [];

    // Parámetros a enviar al archivo PHP
    let params: any;

    if(datos == 'Parcela'){ // Si escoge Parcela como alojamiento
      this.tipos = 'parcela';
      this.electricidad = false;
      params = new HttpParams()
      .set('opcion', '3')
      .set('entrada', this.dateAdapter.format(this.fechas.get('fechaEntrada').value,'YYYY/MM/DD'))
      .set('salida', this.dateAdapter.format(this.fechas.get('fechaSalida').value,'YYYY/MM/DD'));
      this.dato4 = 'Dimension';

    }else{ // Si escoge Bungalow como alojamiento
      this.tipos = 'bungalow';
      this.electricidad = true;
      params = new HttpParams()
      .set('opcion', '5')
      .set('entrada', this.dateAdapter.format(this.fechas.get('fechaEntrada').value,'YYYY/MM/DD'))
      .set('salida', this.dateAdapter.format(this.fechas.get('fechaSalida').value,'YYYY/MM/DD'));
      this.dato4 = 'Máximo de personas';
    }

    // Petición POST para obtener todos los tipos de alojamieto y sus características, FORMULARIO 1, Sombra o habitaciones
    this.http.post('http://localhost/reserva.php', params).subscribe(data =>{
      if(data != null){ // Si recibe algún alojamiento
        Object.keys(data[0]).forEach(key => { // Para sacar las keys del array obtenido desde reserva.php
          this.dato1 = key; // Sin mayúscula
          this.dato2 = key[0].toUpperCase()+key.slice(1); // Primera letra mayúscula
        });

        this.arrayCaract1 = data;
        if(this.dato1 == 'sombra'){
          for (let i = 0; i < this.arrayCaract1.length; i++) {
            const element = this.arrayCaract1[i];
            switch (element[this.dato1]) {
              case '0':
                this.arrayCaract1[i][this.dato1] = 'Nada';
                break;

              case '1':
                this.arrayCaract1[i][this.dato1] = 'Media';
                break;
            
              case '2':
                this.arrayCaract1[i][this.dato1] = 'Bastante';
                break;

              case '3':
                this.arrayCaract1[i][this.dato1] = 'Mucha';
                break;
            }
          }
        }
      }
    }, error => console.log(error));
  }

  // Al escoger la característica 1 consulta en la BD todas las características 2 que hay disponibles para ese tipo de alojamientos con la característica 1 elegida
  getCaracteristica2(datos: string){
    let params2: any;

    if(this.tipos == 'parcela'){
      params2 = new HttpParams()
      .set('opcion', '4')
      .set('entrada', this.dateAdapter.format(this.fechas.get('fechaEntrada').value,'YYYY/MM/DD'))
      .set('salida', this.dateAdapter.format(this.fechas.get('fechaSalida').value,'YYYY/MM/DD'))
      .set('sombra', datos['sombra']);
    }else{
      params2 = new HttpParams()
      .set('opcion', '6')
      .set('entrada', this.dateAdapter.format(this.fechas.get('fechaEntrada').value,'YYYY/MM/DD'))
      .set('salida', this.dateAdapter.format(this.fechas.get('fechaSalida').value,'YYYY/MM/DD'))
      .set('habitaciones', datos['habitaciones']);
    }
     
    this.http.post('http://localhost/reserva.php', params2).subscribe(data =>{
      if(data != null){ // Si recibe algún alojamiento
        this.arrayCaract2 = data;
        Object.keys(data[0]).forEach(key => { // Para sacar las keys del array obtenido desde reserva.php
          this.dato3 = key; // Sin mayúscula
        });
      }
    }, error => console.log(error));
  }


  // Función para validar las fechas, si la fecha de salida es posterior a la de entrada no dará error, en cambio si la fecha de salida es el mismo día de entrada o anterior dará error y te pedirá que cambies de fecha
  validacionFechaSalida(){
      return (): ValidationErrors => {
        if(this.fechas.get('fechaSalida').value != ''){
          this.fechas.get('fechaSalida').setErrors(null);
          this.fechaVal = false;
          let entrada: any = moment(this.fechas.get('fechaEntrada').value);
          let salida: any = moment(this.fechas.get('fechaSalida').value);
          let diferencia = moment.duration(salida-entrada).days();
          if (diferencia <= 0) {
            this.fechas.get('fechaSalida').setErrors({fecha2Mayor: true});
          } else {
            this.fechas.get('fechaSalida').setErrors(null);
          }
        }else{
          this.fechas.get('fechaSalida').setErrors({vacio: true});
        }
      
      return;
    };
    
  }


  // Al elegir un servicio extra, desbloquea el input de al lado para poder introducir la cantidad
  onChange(a, e){
    if(this.serviciosExtras.get('servicio'+a['idServicio']).value){
      this.serviciosExtras.get('num'+a['idServicio']).enable();
    }else{
      this.serviciosExtras.get('num'+a['idServicio']).disable()
    }

  }

  validacionServicio(){
    return (): ValidationErrors => {
      Object.entries(this.serviciosExtras.value).forEach(entries => {
        if(entries[0].slice(0,3) == 'num' && entries[0] != 'num1'){
          if(entries[1] == ''){
            this.serviciosExtras.get(entries[0]).setErrors({'noCantidad': true});
          }else{
            this.serviciosExtras.get(entries[0]).setErrors(null);
          }
        }
        
      });
      return;
    };
  }

  // Función al acabar el último formulario antes del desglose
  addServicios(){

    /*Object.entries(this.serviciosExtras.controls).forEach(entries => {
      console.log(entries);
      
    });

    console.log('Datos fechas');
    console.log(this.fechas.get('fechaEntrada').value);
    console.log(this.fechas.get('fechaSalida').value);

    console.log(' ');
    console.log('Datos alojamiento');
    console.log(this.alojamiento.get('tipo').value);
    console.log(this.alojamiento.get('caracteristicaUnica1').value);
    console.log(this.alojamiento.get('caracteristicaUnica2').value);

    console.log(' ');
    console.log('Datos usuario');
    console.log(this.usuario.get('nombreCompleto').value);
    console.log(this.usuario.get('telefono').value);
    console.log(this.usuario.get('email').value);
    console.log(this.usuario.get('dni').value);*/

    console.log(' ');
    console.log('Servicios extras');
    this.servicios.forEach(element => {
      if(this.serviciosExtras.get('servicio'+element['idServicio']).value == true){
        console.log('servicio'+element['idServicio']+' está marcado');
      }
    });
    console.log(' ');
    console.log('Cantidad');
    this.servicios.forEach(element => {
      //console.log((this.serviciosExtras.get('num'+element['idServicio']).value).length);
      if((this.serviciosExtras.get('num'+element['idServicio']).value).length != 0 && this.serviciosExtras.get('servicio'+element['idServicio']).value == true){
        console.log('num'+element['idServicio']+' con cantidad: '+this.serviciosExtras.get('num'+element['idServicio']).value);
      }
      
    });
    //console.log(this.serviciosExtras.get('nombreCompleto').value);

    
  }


  ngOnInit(): void {

    // Compruebo si hay un usuario con sesión iniciada
    this.usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

    // Formulario 1 - Fechas entrada y salida
    this.fechas = this.fb.group({
      fechaEntrada: ['', [Validators.required]],
      fechaSalida: ['', [Validators.required]],
    });
    this.fechas.setValidators(this.validacionFechaSalida());
    


    // Formulario 2 - Alojamiento
    this.alojamiento = this.fb.group({
      tipo: ['', Validators.required],
      caracteristicaUnica1: ['', Validators.required],
      caracteristicaUnica2: ['', Validators.required],
    });
  

    // Formulario 3 - Datos personales (usuario)
    if(this.usuarioActual != null){
      this.usuario = this.fb.group({
        nombreCompleto: [this.usuarioActual['nombre'], Validators.required],
        telefono: [this.usuarioActual['telefono'], [Validators.required, Validators.pattern('^[6-7][0-9]{8}$')]],
        //FALLA email
        //email: ['', [Validators.required, Validators.pattern("^(((\.)+)?[A-z0-9]+((\.)+)?)+@(((\.)+)?[A-z0-9]+((\.)+)?)+\.[A-z]+$")]],//Puede empezar por . o no, contener letras y numeros seguidos de punto o no, seguido por @ seguido por . o no letras y numeros y punto o no . letras
        email: [this.usuarioActual['email'], [Validators.required, Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)$")]],
        dni: [this.usuarioActual['nif'], [Validators.required, Validators.pattern('^[0-9]{8,8}[A-Za-z]$')]],
      });
    }else{
      this.usuario = this.fb.group({
        nombreCompleto: ['', Validators.required],
        telefono: ['', [Validators.required, Validators.pattern('^[6-7][0-9]{8}$')]],
        //FALLA email
        //email: ['', [Validators.required, Validators.pattern("^(((\.)+)?[A-z0-9]+((\.)+)?)+@(((\.)+)?[A-z0-9]+((\.)+)?)+\.[A-z]+$")]],//Puede empezar por . o no, contener letras y numeros seguidos de punto o no, seguido por @ seguido por . o no letras y numeros y punto o no . letras
        email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)$")]],
        dni: ['', [Validators.required, Validators.pattern('^[0-9]{8,8}[A-Za-z]$')]],
      });
    }
    


    // Formulario 4 - Servicios extras a contratar
    this.serviciosExtras = this.fb.group({});

    let params = new HttpParams()
    .set('opcion', '7');
    // Petición POST para obtener todos los servicios
    this.http.post('http://localhost/reserva.php', params).subscribe(data => {
      if (data != null) { // Si recibe algún alojamiento
        this.servicios = data;
        for (let i = 0; i < this.servicios.length; i++) {
          this.serviciosExtras.addControl('servicio'+this.servicios[i]['idServicio'], new FormControl(false,[]));
          this.serviciosExtras.addControl('num'+this.servicios[i]['idServicio'], new FormControl({value: '', disabled: true},[]));
        }
      }
    }, error => console.log(error));
    this.serviciosExtras.setValidators(this.validacionServicio());

    if(this.usuarioActual != null){ // SIN UTILIDAD AUN
      //console.log(this.usuarioActual);
      /*this.usuario.get('nombreCompleto').setValue(this.usuarioActual['nombre']);
      this.usuario.get('telefono').setValue(this.usuarioActual['telefono']);
      this.usuario.get('email').setValue(this.usuarioActual['email']);
      this.usuario.get('dni').setValue(this.usuarioActual['nif']);*/
      /*let fd: any = new FormData();
      fd.append('alias', this.usuarioActual['alias']);
      fd.append('dni', this.usuarioActual['nif']);
      fd.append('nombre_usuario', this.usuarioActual['nombre']);
      fd.append('telefono', this.usuarioActual['telefono']);
      fd.append('email', this.usuarioActual['email']);
      fd.append('password', this.usuarioActual['password']);
      fd.append('rol', this.usuarioActual['rol']);*/
    }


    


    
      
    

    
  }
}
