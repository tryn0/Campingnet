import { Component, OnInit, Inject, ɵConsole } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import * as moment from 'moment/moment';
import { MatDialog } from '@angular/material/dialog';
import { ReservasLoginComponent } from '../reservas-login/reservas-login.component';
import { ReservasRegistrarComponent } from '../reservas-registrar/reservas-registrar.component';
import { Usuario } from '../usuario/usuario';
import { encriptar, desencriptar } from '../crypto-storage';
import { IfStmt } from '@angular/compiler';

interface DialogData {
  email: any;
}

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
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css'],
  providers: [{
    provide: DateAdapter,
    useClass: MomentDateAdapter,
    deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  },
  {provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_Format}],
  
})
export class ReservasComponent implements OnInit {

  // Variable de sesión iniciada
  public usuarioActual: string;

  // Variables del formulario 1
  public fechas: FormGroup;
  public fecha1: string;
  public fecha2: string;
  public dias: number = 0;
  public alojamientosDisponibles: any;
  public info1: boolean = false;
  public fechaVal: boolean = false;
  public fechaMenos7: boolean = null;
  public multiplicador: number = 0;

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
  public personas: number = 0;
  public precioAlojamiento: number = 0;
  public precioAlojamientoFinal: number = 0;
  public noAlojamiento: boolean = false;

  // Variables del formulario 3
  public serviciosExtras: FormGroup;
  public servicios: any = [];
  public electricidad: boolean = null;
  public checkado: boolean = false;
  public personasExtras: number;
  public personasExtrasMenor: number;
  public personasExtrasMayor: number;
  public extras: any = [];
  public idAlojamientoRandom: number;
  public gentePermitida: number = 12;
  public totalPersonasparcela: number = 0;
  public preciosServicios: any;
  public preciosExtrasFinal: number = 0;

  // Variables del formulario 4
  public usuario: FormGroup;
  public loginReserva: boolean = null;


  public email: any;
  public valor1: any = '';
  public valor2: any = '';
  public persona: Usuario;
  public reservaHecha: boolean = false;
  public reservaId: any = '';

  public errorCorreo: boolean = false;
  
  constructor(private fb: FormBuilder, private http: HttpClient, private dateAdapter: DateAdapter<Date>, public dialog: MatDialog) {
    this.dateAdapter.setLocale('es-ES');
  }

  // Mostrar o escondes (toggle) el mensaje de info del formulario de las fechas
  mostrarInfo1(){
    if(this.info1 == false){
      this.info1 = true;
    }else{
      this.info1 = false;
    }
  }

  // Obtiene listado de alojamientos si las fechas introducidas están correctas
  guardarFechas(){
    this.multiplicador = 0;
    this.noAlojamiento = false;
    this.alojamiento.reset();
    this.serviciosExtras.reset();
    
    this.fechaVal = true;
    if(this.fechas.get('fechaEntrada').value != '' && this.fechas.get('fechaSalida').value != '' && !this.fechas.get('fechaEntrada').errors && !this.fechas.get('fechaSalida').errors){
      this.tipos2 = [];
      this.tipos22 = [];
      this.dias = Math.floor((new Date(this.fechas.get('fechaSalida').value).getTime() - new Date(this.fechas.get('fechaEntrada').value).getTime())/86400000);

      // Parámetros a enviar al archivo PHP
      let params2 = new HttpParams()
      .set('opcion', '1');

      // Petición POST para obtener todos los tipos de alojamieto, FORMULARIO 1, Tipo de alojamiento
      this.http.post('http://34.206.59.221/reserva.php', params2).subscribe(data =>{
        if(data != null && data != 0){ // Si recibe algún alojamiento
          this.tipos2 = data;
          for (let i = 0; i < this.tipos2.length; i++) {
            const element = this.tipos2[i];
            let element2 = element['tipo'][0].toUpperCase()+element['tipo'].slice(1);
            this.tipos22.push(element2);
          }
        }
      }, error => console.log(error));

      let params3 = new HttpParams()
      .set('opcion', '11')
      .set('entrada', (this.fechas.get('fechaEntrada').value).format('YYYY-MM-DD'))
      .set('salida', (this.fechas.get('fechaSalida').value).format('YYYY-MM-DD'));

      // Seteo de fechas para mostrarlas en el desglose
      this.fecha1 = (this.fechas.get('fechaEntrada').value).format('DD-MM-YYYY');
      this.fecha2 = (this.fechas.get('fechaSalida').value).format('DD-MM-YYYY');

      // Para los multiplicativos de las fechas
      this.http.post('http://34.206.59.221/reserva.php', params3).subscribe(data =>{
        if(data != null){ // Si recibe algún alojamiento
          // Total de días
          let diff = Math.floor((new Date(this.fechas.get('fechaSalida').value).getTime() - new Date(this.fechas.get('fechaEntrada').value).getTime())/86400000);
          if(data != 0){
            let data2: any = data;
            
            // Seteo de la variable calculo usada para el multiplicador
            let calculo: number = 0;

            // Cálculo de días en cada temporada
            for (let i = 0; i < data2.length; i++) { // Por cada temporada...
              const element = data2[i];
              // Seteo de las fechas de la temporada
              let inicioTemporada = moment(element['fecha_entrada']);
              let finTemporada = moment(element['fecha_salida']);

              // Seteo de las fechas de la reserva
              let entrada = this.fechas.get('fechaEntrada').value;
              let salida = this.fechas.get('fechaSalida').value;
              // Seteo predefinido de los días entre la fecha de entrada de la reserva y la fecha de inicio de la temporada
              let diasAntes = Math.floor((new Date(element['fecha_entrada']).getTime() - new Date(entrada).getTime())/86400000);
              if(inicioTemporada > entrada){ // Si entra al camping antes de la temporada y...
                if(i != 0){ // Si el índice del for no es igual a 0
                  diasAntes = Math.floor((new Date(element['fecha_entrada']).getTime() - new Date(data[i-1]['fecha_salida']).getTime())/86400000);
                }              
                if(finTemporada >= salida){ // sale del camping antes de que acabe la temporada
                  let total = Math.abs(salida.diff(inicioTemporada, 'days'));
                  //console.log('1 Entra al camping '+diasAntes+' dias antes de que empiece la temporada '+element['nombre_temporada']+', está '+total+' días en la temporada '+element['nombre_temporada']);
                  calculo += ((diasAntes*1)+(total*element['multiplicador']));
                  calculo = calculo/diff;
                  // Seteo del multiplicador a la variable del principio, para guardarla luego en la BD
                  this.multiplicador = parseFloat(calculo.toFixed(2));
                  //console.log('Por lo que su multiplicativo será: ('+diasAntes+'*1+'+total+'*'+element['multiplicador']+')/'+diff+' = '+ calculo.toFixed(2));
                  
                }else{ // sale del camping después de que acabe la temporada
                  let total = Math.abs(finTemporada.diff(inicioTemporada, 'days'));
                  let dias = Math.abs(salida.diff(finTemporada, 'days'));
                  if(data2.length < 2){ // Si hay solo 1 temporada (a parte de la temporada media)
                    //console.log('2 Entra al camping '+diasAntes+' dias antes de la temporada '+element['nombre_temporada']+' pasa '+total+' días en la temporada '+element['nombre_temporada']+' y sale '+dias+' dias despues de que acabe la temporada');
                    calculo = ((diasAntes*1)+(total*element['multiplicador'])+(dias*1))/diff;
                    // Seteo del multiplicador a la variable del principio, para guardarla luego en la BD
                    this.multiplicador = parseFloat(calculo.toFixed(2));
                    //console.log('Por lo que su multiplicativo será: ('+diasAntes+'*1+'+total+'*'+element['multiplicador']+'+'+dias+'*1)/'+diff+' = '+ calculo.toFixed(2));
               
                  }else{ // Si hay más de 1 temporada (cambios de temporada, a parte de la temporada media)
                    let dias2Temp: any;
                    if(data2[i+1] != null){ // Si existe otra temporada por delante
                      dias2Temp = Math.floor((new Date(data2[i+1]['fecha_entrada']).getTime() - new Date(element['fecha_salida']).getTime())/86400000);
                    }else{ // Si no existe otra temporada por delante
                      dias2Temp = Math.floor((new Date(salida).getTime() - new Date(element['fecha_salida']).getTime())/86400000);
                    }
                    calculo += ((diasAntes*1)+(total*element['multiplicador']));
                    //this.multiplicador = parseFloat(calculo.toFixed(2));
                    if(i == data2.length-1) {
                      //console.log(this.dias)
                      calculo += dias2Temp*1;
                      this.multiplicador = parseFloat((calculo/diff).toFixed(2));
                    }
                    // Multiplicador
                    //console.log('3 Está '+diasAntes+' días antes en el camping, pasa '+total+' días de la temporada '+element['nombre_temporada']+ ' y está '+dias2Temp+' en temp media');
                    //console.log('Por lo que su multiplicativo será: ('+diasAntes+'*1+'+total+'*'+element['multiplicador']+') = '+ calculo);
                  }
                }
              }else if(inicioTemporada <= entrada){ // Si entra al camping el mismo día o después del inicio de la temporada
                let dias: any;
                if(finTemporada >= salida){ // sale del camping antes de que acabe la temporada y...
                  dias = Math.floor((new Date(salida).getTime() - new Date(entrada).getTime())/86400000);
                  //console.log('4 Entra al camping el día '+(this.fechas.get('fechaEntrada').value).format('YYYY-MM-DD')+' y sale el día '+(this.fechas.get('fechaSalida').value).format('YYYY-MM-DD')+' un total de '+dias+' días en la temporada '+element['nombre_temporada']);
                  calculo = (dias*element['multiplicador'])/diff
                  // Seteo del multiplicador a la variable del principio, para guardarla luego en la BD
                  this.multiplicador = parseFloat(calculo.toFixed(2));
                  //console.log('Lo cual su multiplicador es: ('+dias+'*'+element['multiplicador']+')/'+diff+' = '+calculo.toFixed(2));
             
                }else{ // sale del camping después de que acabe la temporada
                  dias = Math.floor((new Date(element['fecha_salida']).getTime() - new Date(entrada).getTime())/86400000);
                  if(data2.length < 2){ // Si hay solo 1 temporada (a parte de la temporada media), sale en temporada media
                    let diasSalida = Math.floor((new Date(salida).getTime() - new Date(element['fecha_salida']).getTime())/86400000);
                    calculo = ((dias*element['multiplicador'])+(diasSalida*1))/diff;
                    this.multiplicador = parseFloat(calculo.toFixed(2));
                    //console.log('Entro durante la temporada '+element['nombre_temporada']+' y estuvo '+dias+' en dicha temporada, luego estuvo '+diasSalida+' en temporada media');
               
                  }else{
                    //console.log('Ha entrado durante la temporada y ha estado '+dias+' días en la temporada '+element['nombre_temporada']);
                    calculo += dias*element['multiplicador'];
                  }                 
                }
              }
            }
          }else{ // Si lo que devuelve reserva.php es 0, significa que las fechas no están en ninguna temporada, lo que significa que todos los días de la estancia son en temporada media
            // Seteo del multiplicador a la variable del principio, para guardarla luego en la BD
            this.multiplicador = (diff*1)/diff;
            //console.log('Pasa '+diff+' días en temporada media por lo que el multiplicativo de la reserva es: '+diff+'*1/'+diff+' = '+this.multiplicador);
          }
        }
      }, error => console.log(error));
    }
  }

  // Al escoger un tipo de alojamiento consulta en la BD la característica 1 de todos los alojamientos de ese tipo que estén disponibles entre las fechas indicadas al principio
  getCaracteristica1(datos: string){
    this.noAlojamiento = false;

    // Cada vez que se cambie el tipo de alojamiento que ponga a null los demás campos, para que no permita crear un error, cuando eliges los datos de un tipo de alojamiento y luego cambias el tipo de alojamiento,
    // los datos del anterior alojamiento se quedan guardados y permite seguir con los datos del nuevo alojamiento en blanco,
    // pero en la parte backend guardaba los datos del anterior alojamiento y podría dar un error en la reserva a la hora de hacerla.
    if(this.alojamiento.get('tipo').value != null){
      // Formulario de alojamiento
      this.alojamiento.patchValue({'caracteristicaUnica1': null, 'caracteristicaUnica2': null, 'numPersonas': null, 'numPersonasMenor':null, 'numPersonasMayor': null});
      this.alojamiento.setErrors({'caracteristicaUnica1' : null, 'caracteristicaUnica2' : null});

      // Formulario serviciosExtras, cada vez que se elija un tipo de alojamiento los servicios extras se resetean, si es servicioX se pone false (unchecked), si es numX se pone a null y se deshabilita por defecto (el input se borra y está disable)
      Object.entries(this.serviciosExtras.controls).forEach(entries => {
        if(entries[0].slice(0,-1) == 'servicio'){
          this.serviciosExtras.get([entries[0]]).setValue(false);
        }else if(entries[0].slice(0,-1) == 'num'){
          this.serviciosExtras.get([entries[0]]).setValue(null);
          this.serviciosExtras.get([entries[0]]).disable();
        }
      });
    }

    this.arrayCaract2 = [];

    // Parámetros a enviar al archivo PHP
    let params: any;

    // Si escoge Parcela como alojamiento
    if(datos == 'Parcela'){ 
      this.tipos = 'parcela';
      this.electricidad = false;
      params = new HttpParams()
      .set('opcion', '2')
      .set('entrada', (this.fechas.get('fechaEntrada').value).format('YYYY-MM-DD'))
      .set('salida', (this.fechas.get('fechaSalida').value).format('YYYY-MM-DD'))
      this.dato2 = 'Sombra';
      this.dato4 = 'Dimension';
    }else{ // Si escoge Bungalow como alojamiento
      this.tipos = 'bungalow';
      this.electricidad = true;
      params = new HttpParams()
      .set('opcion', '4')
      .set('entrada', (this.fechas.get('fechaEntrada').value).format('YYYY-MM-DD'))
      .set('salida', (this.fechas.get('fechaSalida').value).format('YYYY-MM-DD'))
      this.dato2 = 'Habitaciones';
      this.dato4 = 'Máximo de personas';
    }

    // Petición POST para obtener todos los tipos de alojamieto y sus características, FORMULARIO 1, Sombra o habitaciones
    this.http.post('http://34.206.59.221/reserva.php', params).subscribe(data =>{
      if(data != null && data != 0){ // Si recibe algún alojamiento
        this.arrayCaract1 = [];
        this.arrayCaract2 = [];
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
              default:
                this.arrayCaract1[i][this.dato1] = 'Desconocido';
                break;
            }
          }
        }
      }else if(data == 0) {
        this.arrayCaract1 = [];
        this.arrayCaract2 = [];
        this.noAlojamiento = true;
      }
    }, error => console.log(error));
  }

  validacionAlojamiento(){
    return (): ValidationErrors => {
      if(this.alojamiento.get('tipo').value == 'Bungalow'){
        this.alojamiento.get('numPersonas').setErrors(null);
        if(this.fechaMenos7 == true){
          this.alojamiento.get('tipo').setErrors({menos7: true});
        }else{
          this.alojamiento.get('tipo').setErrors(null);
        }
      }else{
        if(this.alojamiento.get('numPersonas').value){
          if(this.alojamiento.get('numPersonas').value > 12 || this.alojamiento.get('numPersonas').value < 1){
            this.alojamiento.get('numPersonas').setErrors({'personas': true});
          }
        }else{
          this.alojamiento.get('numPersonas').setErrors({'personas': true});
        }
      }
      return;
    };
  }

  // Al escoger la característica 1 consulta en la BD todas las características 2 que hay disponibles para ese tipo de alojamientos con la característica 1 elegida
  getCaracteristica2(datos: string){
    let params2: any;
    if(this.tipos == 'parcela'){
      params2 = new HttpParams()
      .set('opcion', '3')
      .set('entrada', (this.fechas.get('fechaEntrada').value).format('YYYY-MM-DD'))
      .set('salida', (this.fechas.get('fechaSalida').value).format('YYYY-MM-DD'))
      .set('sombra', datos['sombra']);
    }else{
      params2 = new HttpParams()
      .set('opcion', '5')
      .set('entrada', (this.fechas.get('fechaEntrada').value).format('YYYY-MM-DD'))
      .set('salida', (this.fechas.get('fechaSalida').value).format('YYYY-MM-DD'))
      .set('habitaciones', datos['habitaciones']);
    }
     
    this.http.post('http://34.206.59.221/reserva.php', params2).subscribe(data =>{
      if(data != null && data != 0){ // Si recibe algún alojamiento
        this.arrayCaract2 = data;
        Object.keys(data[0]).forEach(key => { // Para sacar las keys del array obtenido desde reserva.php
          this.dato3 = key; // Sin mayúscula
        });
      }
    }, error => console.log(error));
  }

  alojamientoElegido(){ // Seteo de cantidad personas en la reserva
    Object.entries(this.serviciosExtras.value).forEach(entries => {
      //console.log(entries)
      if(entries[0] == 'num2' || entries[0] == 'num3' || entries[0] == 'num4') {
        this.serviciosExtras.get('servicio'+entries[0].slice(3)).setValue(false);
        this.serviciosExtras.get(entries[0]).setValue('');
        this.serviciosExtras.get(entries[0]).disable();
      }
    });
    if(this.alojamiento.get('tipo').value == 'Parcela'){
      let personasTotal = this.alojamiento.get('numPersonas').value;
      if(personasTotal > 2){
        this.personas = 2;
        this.personasExtras = personasTotal - 2;
      }else{
        this.personas =  this.alojamiento.get('numPersonas').value;
        this.personasExtras = null;
      }
      this.totalPersonasparcela = 0 + this.personas; // Refrescar personas disponibles en la reserva
    }else{
      this.personasExtras = null;
    }
    if (this.personasExtras > 0){
      this.serviciosExtras.get('servicio2').patchValue(true);
      this.serviciosExtras.get('num2').patchValue(this.personasExtras);
      this.serviciosExtras.get('num2').enable();
    }
  }

  // Función para validar las fechas, si la fecha de salida es posterior a la de entrada no dará error, en cambio si la fecha de salida es el mismo día de entrada o anterior dará error y te pedirá que cambies de fecha
  validacionFecha(){
      return (): ValidationErrors => {
        if(this.fechas.get('fechaSalida').value != ''){
          this.fechas.get('fechaSalida').setErrors(null);
          this.fechaVal = false;
          let diff = Math.floor((new Date(this.fechas.get('fechaSalida').value).getTime() - new Date(this.fechas.get('fechaEntrada').value).getTime())/86400000);
          if (diff <= 0) {
            this.fechas.get('fechaSalida').setErrors({fecha2Mayor: true});
          }else if(diff > 0){
            this.fechas.get('fechaSalida').setErrors(null);
          } 
          if((this.fechas.get('fechaEntrada').value).month() == 6 || (this.fechas.get('fechaEntrada').value).month() == 7){
            if(diff >= 0 && diff < 7){
              this.fechaMenos7 = true;
              if(this.alojamiento.get('tipo').value == 'Bungalow'){
                this.alojamiento.get('tipo').setErrors({menos7: true});
              }
            }else if(diff >= 7){
              this.fechaMenos7 = false;
              this.alojamiento.get('tipo').setErrors(null);
            }
          }else{
            this.alojamiento.get('tipo').setErrors(null);
          }
        }else{
          this.fechas.get('fechaSalida').setErrors({vacio: true});
        }
      return;
    };
  }

  // Al elegir un servicio extra, desbloquea el input de al lado para poder introducir la cantidad
  onChange(a){
    if(this.serviciosExtras.get('servicio'+a['idServicio']).value){
      this.serviciosExtras.get('num'+a['idServicio']).enable();
    }else{
      this.serviciosExtras.get('num'+a['idServicio']).disable();
      this.serviciosExtras.get('num'+a['idServicio']).setValue('');
      this.totalPersonasparcela = 0 + this.personas; // Refrescar personas disponibles en la reserva
    }    
  }

  /* Validación para el FormGroup de serviciosExtras,
  comprueba si se ha marcado algún checkbox y si se ha introducido una cantidad 
  en su correspondiente <input>, si no se ha escrito crea un error para que no pueda continuar el formulario*/
  validacionServicio(){
    return (): ValidationErrors => {
      let totalPersonasparcela2: number = 0;
      Object.entries(this.serviciosExtras.value).forEach(entries => {
        if(entries[0].slice(0,3) == 'num' && entries[0] != 'num1'){
          if(entries[0] == 'num2' || entries[0] == 'num3' || entries[0] == 'num4'){
            totalPersonasparcela2 += (entries[1] as number);
            this.totalPersonasparcela = totalPersonasparcela2 + this.personas;
          }
          if(entries[1] == '' || entries[1] == null){ // Si el servicio elegido no está en blanco
            this.serviciosExtras.get(entries[0]).setErrors({'noCantidad': true});
          }else if(entries[1] <= 0 || entries[1] > 12) { // Si el servicio elegido no está entre 0 y 12
            this.serviciosExtras.get(entries[0]).setErrors({'muchaCantidad': true});
          }else { // Tó correcto
            if((this.personas+totalPersonasparcela2) > 12) { // La suma de todas las personas
              this.serviciosExtras.get(entries[0]).setErrors({'muchaGente': true});
            }else{
              if(this.alojamiento.get('numPersonas').value == 1 && (this.serviciosExtras.get('num2').value > 0 || this.serviciosExtras.get('num3').value > 0 || this.serviciosExtras.get('num4').value > 0)) {
                this.serviciosExtras.get(entries[0]).setErrors({'noGente': true});
              }else{
                this.serviciosExtras.get(entries[0]).setErrors(null);
              }
            }
          }
        }
      });
      return;
    };
  }

  /**
   * * Recopila información de todos los formularios y consulta a la base de datos la información necesaria
   * * para crear un desglose de precios e información con sus precios
   */
  addServicios(){
    this.preciosExtrasFinal = 0;
    this.extras = [];
    this.valor1 = Object.values(this.alojamiento.get('caracteristicaUnica1').value)[0];
    this.valor2 = Object.values(this.alojamiento.get('caracteristicaUnica2').value)[0];
    
    Object.entries(this.serviciosExtras.value).forEach(entries => {
      if(entries[0] != 'num1' && entries[1] != false){
        for (let i = 0; i < this.servicios.length; i++) {
          const element = this.servicios[i];
          if(entries[0] == 'servicio'+element['idServicio']){
            let cant = this.serviciosExtras.get('num'+element['idServicio']).value ? this.serviciosExtras.get('num'+element['idServicio']).value : 0;
            this.extras.push([element['nombre'], element['idServicio'], cant]);
            break;
          }
        }
      }
    }); 

    let params2 = new HttpParams()
    .set('opcion', '8')
    .set('tipo', this.alojamiento.get('tipo').value)
    .set('caract1',this.valor1)
    .set('caract2', this.valor2);

    /**
     * ? https://trello.com/b/4xofW6oE
     */

    // Obtención de los precios
    this.http.post('http://34.206.59.221/reserva.php', params2).subscribe(data =>{
      if(data != null && data!= 0){ // Si recibe algún alojamiento
        this.idAlojamientoRandom = data[0]['idAlojamiento'];
        let precioAlojamiento2 = new HttpParams()
        .set('opcion', '9')
        .set('idAlojamiento', this.idAlojamientoRandom.toString());
        let k = new HttpParams()
        .set('opcion','10');
        this.http.post('http://34.206.59.221/reserva.php', precioAlojamiento2).subscribe(data =>{
          if(data != null && data != 0){ // Si recibe algún dato
            this.precioAlojamiento = data[0]['precio'];
            for (let i = 0; i < this.extras.length; i++) {
              const element = this.extras[i];
              k = k.set(element[1], element[2]);
            }
            this.precioAlojamientoFinal = ((this.precioAlojamiento*this.dias)*this.multiplicador);
            //console.log('Precio alojamiento final = ('+this.precioAlojamiento+'*'+this.dias+')*'+this.multiplicador);
            this.http.post('http://34.206.59.221/reserva.php', k).subscribe(data =>{
              if(data != null && data != 0){ // Si recibe algún dato
                this.preciosServicios = data;
                for (let i = 0; i < this.extras.length; i++) {
                  const element = this.extras[i];
                  for (let k = 0; k < this.preciosServicios.length; k++) {
                    const elemento = this.preciosServicios[k];
                    if(elemento[0]['idServicio'] == element[1]) {
                      if(element[2] == 0){
                        this.preciosExtrasFinal += 1*elemento[0]['precio'];
                      }else{
                        this.preciosExtrasFinal += element[2]*elemento[0]['precio'];
                      }
                    }
                  }
                }
              }
            });
          }
        }, error => console.log(error));
      }
    }, error => console.log(error));
  }

  confirmarReserva(){
    if (this.usuarioActual != null) {
      this.reserva();
    }
  }

  reserva() { // Si confirma la reserva, y tiene una sesión iniciada
    if(this.usuarioActual != null) {
      let params2: any;
      let totalPersonas: number;
      if (this.persona != null) {
        // Igualar a 0 las variables para que no de errores al paasarlas por HttpParams
        let persExtras: number = 0;
        if (this.personasExtras > 0) {
          persExtras = this.personasExtras;
        }
        if (this.alojamiento.get('tipo').value == 'Bungalow') {
          persExtras = 0;
          totalPersonas = this.valor2;
        } else {
          let mayor = null ? this.serviciosExtras.get('num3').value : 0;
          let menor = null ? this.serviciosExtras.get('num4').value : 0;
          totalPersonas = this.personas + persExtras + mayor + menor;
        }
        params2 = new HttpParams()
          .set('opcion', '7')
          // Fechas
          .set('entrada', (this.fechas.get('fechaEntrada').value).format('YYYY-MM-DD'))
          .set('salida', (this.fechas.get('fechaSalida').value).format('YYYY-MM-DD'))

          // Alojamiento
          .set('alojamiento', this.alojamiento.get('tipo').value)
          .set('caract1', this.valor1) // * Esto en reserva.php sale como un string con forma de array ARREGLAR
          .set('caract2', this.valor2) // * Esto en reserva.php sale como un string con forma de array ARREGLAR
          .set('idAlojamiento', this.idAlojamientoRandom.toString())

          // Datos del usuario para sacar idUsuario e introducirlo en la tabla reserva
          .set('nombreUsuario', this.usuarioActual['nombre'])
          .set('telefono', this.usuarioActual['telefono'])
          .set('email', this.usuarioActual['email'])
          .set('dni', this.usuarioActual['nif'])
          .set('alias', this.usuarioActual['alias'])

          // Detalles de la reserva
          .set('numPersonas', totalPersonas.toString()) // Entre 12 y 64
          .set('multiplicativo', this.multiplicador.toString());
        for (let i = 0; i < this.extras.length; i++) {
          const element = this.extras[i];
          // ID del servicio extra y la cantidad
          params2 = params2.set(element[1], element[2]);
        }

        /**
         * * Esto es para guardar la reserva en la BD
         */
        this.http.post('http://34.206.59.221/reserva.php', params2).subscribe(data => {
          if (data != null && data != 0) { // Si recibe algún alojamiento
            this.reservaId = data;
            this.reservaHecha = true;

            let jsonReserva = {
              persona: {
                email: this.persona.email, 
                nombre: this.persona.nombre
              }, 
              fechas: {
                entrada: (this.fechas.get('fechaEntrada').value).format('YYYY-MM-DD'), 
                salida: (this.fechas.get('fechaSalida').value).format('YYYY-MM-DD')
              },
              datosReserva: {
                alojamiento: this.alojamiento.get('tipo').value,
                idReserva: this.reservaId,
                precioTotalFinal: (this.precioAlojamientoFinal + this.preciosExtrasFinal).toFixed(2)
              }
            };

            let jsonEncriptado = encriptar(JSON.stringify(jsonReserva));
            //console.log(JSON.stringify(jsonReserva))
            console.log(jsonEncriptado)

            const httpOptions = {
              headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded', 
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method',
                'Access-Control-Allow-Methods': 'GET, POST',
                'Allow': 'GET, POST'
              })
            };

            let datos = new HttpParams()
            .set('reserva', jsonEncriptado);
            this.http.post("http://us-central1-campingnet-pi.cloudfunctions.net/reservaConfirmacion", datos, httpOptions).subscribe(data => {
              if(data != '1') {
                this.errorCorreo = true;
              }
            });
          }
        }, error => console.log(error));
      }else{
        this.persona = this.persona = new Usuario(this.usuarioActual['id'], this.usuarioActual['email'], this.usuarioActual['nif'], this.usuarioActual['nombre'], this.usuarioActual['rol'], this.usuarioActual['telefono'], this.usuarioActual['alias']);
        this.reserva();
      }
    }
  }

  /**
   * * Popup para iniciar sesión y hacer la reserva
   */
  logIn(){ // Si confirma la reserva, NO tiene una sesión iniciada y tiene una cuenta creada
    const dialogRef = this.dialog.open(ReservasLoginComponent, {
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.email = result;
      if(this.email == 'Error'){
        this.loginReserva = false;
      }else if(this.email != undefined && this.email['id']){
        this.loginReserva = true;   
        if(this.email != null){
          if (this.usuarioActual == null) {
            if(localStorage.getItem('usuarioActual') != null){
              this.usuarioActual = desencriptar(localStorage.getItem('usuarioActual'));
              this.reserva();
            }
          }
        }
      }
    });
  }

  /**
   * * Popup para registrarse y hacer la reserva
   */
  signIn(){// Si confirma la reserva, NO tiene una sesión iniciada y NO tiene una cuenta creada
    const dialogRef = this.dialog.open(ReservasRegistrarComponent, {
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.email = result;
      if(this.email == 'Error'){
        this.loginReserva = false;
      }else if(this.email != undefined && this.email['id']){
        this.loginReserva = true;   
        if(this.email != null){
          if (this.usuarioActual == null) {
            if(localStorage.getItem('usuarioActual') != null){
              this.usuarioActual = desencriptar(localStorage.getItem('usuarioActual'));
              this.reserva();
            }
          }
        }
      }
    });
  }


  ngOnInit(): void {
    // Compruebo si hay un usuario con sesión iniciada
    if (this.usuarioActual == null) {
      if(localStorage.getItem('usuarioActual') != null){
        this.usuarioActual = desencriptar(localStorage.getItem('usuarioActual'));
      }
    }

    // Formulario 1 - Fechas entrada y salida
    this.fechas = this.fb.group({
      fechaEntrada: ['', [Validators.required]],
      fechaSalida: ['', [Validators.required]],
    });
    this.fechas.setValidators(this.validacionFecha()); // Validator personalizado

    // Formulario 2 - Alojamiento
    this.alojamiento = this.fb.group({
      tipo: ['', Validators.required],
      caracteristicaUnica1: ['', Validators.required],
      caracteristicaUnica2: ['', Validators.required],
      numPersonas: ['', Validators.required],
    });
    this.alojamiento.setValidators(this.validacionAlojamiento()); // Validator personalizado

    // Formulario 3 - Datos personales (usuario)
    if(this.usuarioActual != null){
      this.persona = new Usuario(this.usuarioActual['id'], this.usuarioActual['email'], this.usuarioActual['nif'], this.usuarioActual['nombre'], this.usuarioActual['rol'], this.usuarioActual['telefono'], this.usuarioActual['alias']);
    }else{
      this.usuario = this.fb.group({
        nombreCompleto: ['', Validators.required],
        telefono: ['', [Validators.required, Validators.pattern('^[6-7][0-9]{8}$')]],
        //! FALLA email
        // email: ['', [Validators.required, Validators.pattern("^(((\.)+)?[A-z0-9]+((\.)+)?)+@(((\.)+)?[A-z0-9]+((\.)+)?)+\.[A-z]+$")]],//Puede empezar por . o no, contener letras y numeros seguidos de punto o no, seguido por @ seguido por . o no letras y numeros y punto o no . letras
        //? HACER ALGO PARA CONTROLAR EL EMAIL (PATTERN)
        email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)$")]],
        dni: ['', [Validators.required, Validators.pattern('^[0-9]{8,8}[A-Za-z]$')]],
      });
    }

    // Formulario 4 - Servicios extras a contratar
    this.serviciosExtras = this.fb.group({}); // Inicializar el FormBuilder y luego agregarle de forma dinámica los Controls
    let params = new HttpParams()
    .set('opcion', '6');
    // Petición POST para obtener todos los servicios
    this.http.post('http://34.206.59.221/reserva.php', params).subscribe(data => {
      if (data != null && data != 0) { // Si recibe algún alojamiento
        this.servicios = data;
        for (let i = 0; i < this.servicios.length; i++) {
          this.serviciosExtras.addControl('servicio'+this.servicios[i]['idServicio'], new FormControl(false,[]));
          this.serviciosExtras.addControl('num'+this.servicios[i]['idServicio'], new FormControl({value: '', disabled: true},[]));
        }
      }
    }, error => console.log(error));
    this.serviciosExtras.setValidators(this.validacionServicio());
  }
}