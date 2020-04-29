import { Component, OnInit, Inject, ɵConsole } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DateAdapter } from '@angular/material/core';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ReservasLoginComponent } from '../reservas-login/reservas-login.component';
import { Usuario } from '../usuario/usuario';


interface DialogData {
  email: any;
}

/**
 * TODO: PEDIR LOS DATOS PERSONALES AL FINAL DESPUES DEL DESGLOSE, DAR 2 OPCIONES, LOGUEARSE Y GUARDAR LA RESERVA, O REGISTRARSE Y GUARDAR LA RESERVA
 * TODO: UNA VEZ HA ACABADO DE HACER LA RESERVA, CONSULTAR TODOS LOS DATOS A LA BASE DE DATOS, CALCULAR EL MULTIPLICATIVO POR EL TEMA DE LA TEMPORADA
 * TODO: EL PRECIO POR EL AOJAMIENTO Y EL PRECIO POR LOS SERVICIOS EXTRAS
 * TODO: LUEGO MULTIPLICAR EL MULTIPLICATIVO POR EL PRECIO DEL ALOJAMIENTO Y SUMARLE A ESTE TODOS LOS SERVICIOS EXTRAS
 * TODO: MOSTRAR EL PRECIO DE CADA COSA Y ABAJO DE LTODO LA SUMA TOTAL, EN EL CASO DEL ALOJAMIENTO MOSTRARLO CON EL MULTIPLICATIVO DESGLOSADO
 */

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
  public fechaMenos7: boolean = null;
  public multiplicador: number;

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
  public serviciosExtras: FormGroup;
  public servicios: any = [];
  public electricidad: boolean = null;
  public checkado: boolean = false;

  // Variables del formulario 4
  public usuario: FormGroup;
  public loginReserva: boolean = null;

  public email: any;

  public valor1: any = '';
  public valor2: any = '';

  public persona: Usuario;
  

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
    this.fechaVal = true;
    if(this.fechas.get('fechaEntrada').value != '' && this.fechas.get('fechaSalida').value != '' && !this.fechas.get('fechaEntrada').errors && !this.fechas.get('fechaSalida').errors){
      this.tipos2 = [];
      this.tipos22 = [];      

      // Parámetros a enviar al archivo PHP
      let params2 = new HttpParams()
      .set('opcion', '1');

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

      let params3 = new HttpParams()
      .set('opcion', '8')
      .set('entrada', (this.fechas.get('fechaEntrada').value).format('YYYY-MM-DD'))
      .set('salida', (this.fechas.get('fechaSalida').value).format('YYYY-MM-DD'));

      // Para los multiplicativos de las fechas
      this.http.post('http://localhost/reserva.php', params3).subscribe(data =>{
        if(data != null){ // Si recibe algún alojamiento
          console.log(data);

          // Total de días
          let diff = Math.floor((new Date(this.fechas.get('fechaSalida').value).getTime() - new Date(this.fechas.get('fechaEntrada').value).getTime())/86400000)+1;

          if(data != 0){
            let data2: any = data;
            //console.log((this.fechas.get('fechaEntrada').value).format('YYYY-MM-DD'));
            //console.log((this.fechas.get('fechaSalida').value).format('YYYY-MM-DD'));

            //console.log('Días de la reserva: '+diff);
            //console.log(data2);

            // Seteo de la variable calculo usada para el multiplicador
            let calculo: number = 0;

            // Cálculo de días en cada temporada
            for (let i = 0; i < data2.length; i++) { // Por cada temporada...
              const element = data2[i];
              //console.log(element);

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
                  let total = Math.abs(salida.diff(inicioTemporada, 'days'))+1;
                  
                  //console.log('Entra al camping '+diasAntes+' dias antes de que empiece la temporada '+element['nombre_temporada']+', está '+total+' días en la temporada '+element['nombre_temporada']);
                  calculo += diasAntes*1+total*element['multiplicador'];
                  calculo = calculo/diff;

                  // Seteo del multiplicador a la variable del principio, para guardarla luego en la BD
                  this.multiplicador = parseFloat(calculo.toFixed(2));
                  console.log('Por lo que su multiplicativo será: ('+diasAntes+'*1+'+total+'*'+element['multiplicador']+')/'+diff+' = '+ calculo.toFixed(2));
          
                }else{ // sale del camping después de que acabe la temporada
                  
                  let total = Math.abs(finTemporada.diff(inicioTemporada, 'days'))+1;
                  let dias = Math.abs(salida.diff(finTemporada, 'days'));
                  if(data2.length < 2){ // Si hay solo 1 temporada (a parte de la temporada media)
                    //console.log('Entra al camping '+diasAntes+' dias antes de la temporada '+element['nombre_temporada']+' pasa '+total+' días en la temporada '+element['nombre_temporada']+' y sale '+dias+' dias despues de que acabe la temporada');

                    calculo = (diasAntes*1+total*element['multiplicador']+dias*1)/diff;

                    // Seteo del multiplicador a la variable del principio, para guardarla luego en la BD
                    this.multiplicador = parseFloat(calculo.toFixed(2));

                    console.log('Por lo que su multiplicativo será: ('+diasAntes+'*1+'+total+'*'+element['multiplicador']+'+'+dias+'*1)/'+diff+' = '+ calculo.toFixed(2));
                  }else{ // Si hay más de 1 temporada (cambios de temporada, a parte de la temporada media)
                    let dias2Temp: any;
                    if(data2[i+1] != null){ // Si existe otra temporada por delante
                      dias2Temp = Math.floor((new Date(data2[i+1]['fecha_entrada']).getTime() - new Date(element['fecha_salida']).getTime())/86400000);
                    }else{ // Si no existe otra temporada por delante
                      dias2Temp = Math.floor((new Date(salida).getTime() - new Date(element['fecha_salida']).getTime())/86400000);
                    }
                    //console.log('Está '+diasAntes+' días antes en el camping, pasa '+total+' días de la temporada '+element['nombre_temporada']+ ' y está '+dias2Temp+' en temp media');

                    // Multiplicador
                    calculo += diasAntes*1+total*element['multiplicador'];
                    console.log('Por lo que su multiplicativo será: ('+diasAntes+'*1+'+total+'*'+element['multiplicador']+') = '+calculo);
                  }
          
                }
                
              }else if(inicioTemporada <= entrada){ // Si entra al camping el mismo día o después del inicio de la temporada

                let dias: any;
                if(finTemporada >= salida){ // sale del camping antes de que acabe la temporada y...
                  dias = Math.floor((new Date(salida).getTime() - new Date(entrada).getTime())/86400000)+1;

                  //console.log('Entra al camping el día '+(this.fechas.get('fechaEntrada').value).format('YYYY-MM-DD')+' y sale el día '+(this.fechas.get('fechaSalida').value).format('YYYY-MM-DD')+' un total de '+dias+' días en la temporada '+element['nombre_temporada']);
                  calculo = (dias*element['multiplicador'])/diff

                  // Seteo del multiplicador a la variable del principio, para guardarla luego en la BD
                  this.multiplicador = parseFloat(calculo.toFixed(2));
                  console.log('Lo cual su multiplicador es: ('+dias+'*'+element['multiplicador']+')/'+diff+' = '+calculo.toFixed(2));
                }else{ // sale del camping después de que acabe la temporada
                  dias = Math.floor((new Date(element['fecha_salida']).getTime() - new Date(entrada).getTime())/86400000)+1;
                  if(data2.length < 2){ // Si hay solo 1 temporada (a parte de la temporada media), sale en temporada media
                    let diasSalida = Math.floor((new Date(salida).getTime() - new Date(element['fecha_salida']).getTime())/86400000)+1;
                    calculo = (dias*element['multiplicador']+diasSalida*1)/diff;
                    this.multiplicador = parseFloat(calculo.toFixed(2));
                    //console.log(calculo.toFixed(2));
                    console.log('Entro durante la temporada '+element['nombre_temporada']+' y estuvo '+dias+' en dicha temporada, luego estuvo '+diasSalida+' en temporada media');
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
            console.log('Pasa '+diff+' días en temporada media por lo que el multiplicativo de la reserva es: '+diff+'*1/'+diff+' = '+this.multiplicador);
          }
        }
      }, error => console.log(error));
    }
  }

  // Al escoger un tipo de alojamiento consulta en la BD la característica 1 de todos los alojamientos de ese tipo que estén disponibles entre las fechas indicadas al principio
  getCaracteristica1(datos: string){ 

    // Cada vez que se cambie el tipo de alojamiento que ponga a null los demás campos, para que no permita crear un error, cuando eliges los datos de un tipo de alojamiento y luego cambias el tipo de alojamiento,
    // los datos del anterior alojamiento se quedan guardados y permite seguir con los datos del nuevo alojamiento en blanco,
    // pero en la parte backend guardaba los datos del anterior alojamiento y podría dar un error en la reserva a la hora de hacerla.
    if(this.alojamiento.get('tipo').value != null){

      // Formulario de alojamiento
      this.alojamiento.patchValue({'caracteristicaUnica1': null, 'caracteristicaUnica2': null, 'numPersonas': null});
      this.alojamiento.setErrors({'caracteristicaUnica1' : null, 'caracteristicaUnica2' : null});

      // Formulario serviciosExtras, cada vez que se elija un tipo de alojamiento los servicios extras se resetean, si es servicioX se pone false (unchecked), si es numX se pone a null y se deshabilita por defecto (el input se borra y está disable)
      Object.entries(this.serviciosExtras.controls).forEach(entries => {
        //console.log(entries[0].slice(0,-1));
        if(entries[0].slice(0,-1) == 'servicio'){
          this.serviciosExtras.get([entries[0]]).setValue(false);
        }else if(entries[0].slice(0,-1) == 'num'){
          this.serviciosExtras.get([entries[0]]).setValue(null);
          this.serviciosExtras.get([entries[0]]).disable();
        }
        

      });
      
      //console.log(this.serviciosExtras);


      /**
       * TODO: Poner a null los inputs y los checkboxs
       */
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
      .set('entrada', this.dateAdapter.format(this.fechas.get('fechaEntrada').value,'YYYY/MM/DD'))
      .set('salida', this.dateAdapter.format(this.fechas.get('fechaSalida').value,'YYYY/MM/DD'));
      this.dato4 = 'Dimension';

    }else{ // Si escoge Bungalow como alojamiento
      this.tipos = 'bungalow';
      this.electricidad = true;
      params = new HttpParams()
      .set('opcion', '4')
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
      .set('entrada', this.dateAdapter.format(this.fechas.get('fechaEntrada').value,'YYYY/MM/DD'))
      .set('salida', this.dateAdapter.format(this.fechas.get('fechaSalida').value,'YYYY/MM/DD'))
      .set('sombra', datos['sombra']);
    }else{
      params2 = new HttpParams()
      .set('opcion', '5')
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
      this.serviciosExtras.get('num'+a['idServicio']).disable()
    }

  }

  /* Validación para el FormGroup de serviciosExtras,
  comprueba si se ha marcado algún checkbox y si se ha introducido una cantidad 
  en su correspondiente <input>, si no se ha escrito crea un error para que no pueda continuar el formulario*/
  validacionServicio(){
    return (): ValidationErrors => {
      Object.entries(this.serviciosExtras.value).forEach(entries => {
        if(entries[0].slice(0,3) == 'num' && entries[0] != 'num1'){
          if(entries[1] == '' || entries[1] == null){
            this.serviciosExtras.get(entries[0]).setErrors({'noCantidad': true});
          }else{
            this.serviciosExtras.get(entries[0]).setErrors(null);
          }
        }
      });
      return;
    };
  }

  /**
   * * Recopila información de todos los formularios y consulta a la base de datos la información necesaria
   * * para crear un desglose de precios e información con sus precios
   * TODO: Consultar el tema de temporada y añadir el multiplicativo a la reserva,
   * TODO: para ello hay que pasar las fechas a moment(creo que ya lo están) y contar el nº de días entre la fecha de entrada hasta la primera que sea de otra temporada, 
   * TODO: si la fecha de salida está antes, la reserva es de esa temporada, sino calcular los días con ese multiplicativo y luego los demas en la otra temporada.
   */
  addServicios(){
    /**
     * ? Estos console.log() son solo para ver qué devuelve al final cuando acabas el formulario de la reserva
     * 
     * ! NO DEJAR CUANDO SE ENTREGUE EL CÓDIGO
     */

    /*Object.entries(this.serviciosExtras.controls).forEach(entries => {
      console.log(entries);
      
    });*/

    /*console.log('Datos fechas');
    console.log(this.fechas.get('fechaEntrada').value);
    console.log(this.fechas.get('fechaSalida').value);
    console.log(this.multiplicador);

    console.log(' ');
    console.log('Datos alojamiento');
    console.log(this.alojamiento.get('tipo').value);
    console.log(this.alojamiento.get('caracteristicaUnica1').value);
    console.log(this.alojamiento.get('caracteristicaUnica2').value);

    console.log(' ');
    console.log('Datos usuario');
    console.log(this.persona['nombre']);
    console.log(this.persona['telefono']);
    console.log(this.persona['email']);
    console.log(this.persona['nif']);

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
      if((this.serviciosExtras.get('num'+element['idServicio']).value).length != 0 && this.serviciosExtras.get('servicio'+element['idServicio']).value == true){
        console.log('num'+element['idServicio']+' con cantidad: '+this.serviciosExtras.get('num'+element['idServicio']).value);
      }
      
    });*/

    //console.log(this.usuarioActual);



    
  }

  logIn(){
    const dialogRef = this.dialog.open(ReservasLoginComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.email = result;
      if(this.email == 'Error'){
        this.loginReserva = false;
      }else if(this.email != undefined && this.email['id']){
        this.loginReserva = true;
        console.log(this.email);

        let valor: any;
        if(this.alojamiento.get('tipo').value == "Bungalow"){
          valor = '0';
        }else{
          if(this.serviciosExtras.get('num2').value != null){
            valor =  (parseInt(this.serviciosExtras.get('num2').value)+2).toString();
          }else{
            valor = '0';
          }
        }

        let params = new HttpParams()
        .set('opcion', '7')
        .set('fechaEntrada', this.fechas.get('fechaEntrada').value)
        .set('fechaSalida', this.fechas.get('fechaSalida').value)
        .set('alojamiento', this.alojamiento.get('tipo').value)
        .set('caract1',this.valor1)// * Esto en reserva.php sale como un string con forma de array ARREGLAR
        .set('caract2', this.valor2)// * Esto en reserva.php sale como un string con forma de array ARREGLAR
        .set('personasExtras', valor)
        .set('multiplicativo', this.multiplicador.toString())
        .set('nombreUsuario', this.email.nombre)
        .set('telefono', this.email.telefono.toString())
        .set('email', this.email.email)
        .set('dni', this.email.nif)
        .set('alias', this.email.alias);        

        console.log(params);
        console.log(this.serviciosExtras.get('num2').value);

        // AQUI INSERTAR EL CODIGO PARA HACER LA RESERVA EN PHP CON EL EMAIL DEL USUARIO Y LOS DATOS DEL DESGLOSE


      }
      
    });
  }

  reserva(){
      this.valor1 = Object.values(this.alojamiento.get('caracteristicaUnica1').value)[0];

        let params2: any;
        if(this.persona != null){

          let valor: string;
          if(this.serviciosExtras.get('num2').value != null){
            valor = this.serviciosExtras.get('num2').value;
          }else{
            valor = '0';
          }

          let numPersonas: string;
          if(this.alojamiento.get('tipo').value == 'Bungalow'){
            
            numPersonas = this.alojamiento.get('caracteristicaUnica2').value['maximo_personas'];
          }else{
            numPersonas = this.alojamiento.get('numPersonas').value;
          }
          


          params2 = new HttpParams()
          .set('opcion', '7')
          .set('fechaEntrada', this.fechas.get('fechaEntrada').value)
          .set('fechaSalida', this.fechas.get('fechaSalida').value)
          .set('alojamiento', this.alojamiento.get('tipo').value)
          .set('caract1',this.valor1)// * Esto en reserva.php sale como un string con forma de array ARREGLAR
          .set('caract2', this.valor2)// * Esto en reserva.php sale como un string con forma de array ARREGLAR
          .set('personasExtra', valor.toString())
          .set('multiplicativo', this.multiplicador.toString())
          .set('nombreUsuario', this.persona['nombre'])
          .set('telefono', this.persona['telefono'].toString())
          .set('email', this.persona['email'])
          .set('dni', this.persona['nif'])
          .set('alias', this.persona['alias'])
          .set('numPersonas', numPersonas.toString());
          
        }
        
        console.log(params2);

        /**
         * TODO: Hacer que envie el tema de los datos a reserva.php
         */

        /*this.http.post('http://localhost/reserva.php', params2).subscribe(data =>{
          if(data != null){ // Si recibe algún alojamiento
            console.log(data);
          }
        }, error => console.log(error));*/
  }


  ngOnInit(): void {

    // Compruebo si hay un usuario con sesión iniciada
    this.usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

    // Formulario 1 - Fechas entrada y salida
    this.fechas = this.fb.group({
      fechaEntrada: ['', [Validators.required]],
      fechaSalida: ['', [Validators.required]],
    });
    this.fechas.setValidators(this.validacionFecha());
    


    // Formulario 2 - Alojamiento
    this.alojamiento = this.fb.group({
      tipo: ['', Validators.required],
      caracteristicaUnica1: ['', Validators.required],
      caracteristicaUnica2: ['', Validators.required],
      numPersonas: ['', Validators.required]
    });
    this.alojamiento.setValidators(this.validacionAlojamiento());
  

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
    this.serviciosExtras = this.fb.group({});

    let params = new HttpParams()
    .set('opcion', '6');
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


  }
}