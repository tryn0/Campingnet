import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';

import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css'],
  
})
export class ReservasComponent implements OnInit {

  // Variable de sesión iniciada
  public usuarioActual: string;


  // Variables del formulario 1
  public fecha1: Date;
  public fecha2: Date;
  public alojamientosDisponibles: any;


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
  

  // Variables del formulario 2
  public usuario: FormGroup;


  // Variables del formualrio 3
  public fechas: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('es-ES');
    
  }

  guardarFechas(){ // Obtiene listado de alojamientos si las fechas introducidas están correctas
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

  getCaracteristica1(datos: string){
    this.arrayCaract2 = [];

    // Parámetros a enviar al archivo PHP
    let params: any;

    if(datos == 'Parcela'){ // Si escoge Parcela como alojamiento
      this.tipos = 'parcela';
      params = new HttpParams()
      .set('opcion', '3')
      .set('entrada', this.dateAdapter.format(this.fechas.get('fechaEntrada').value,'YYYY/MM/DD'))
      .set('salida', this.dateAdapter.format(this.fechas.get('fechaSalida').value,'YYYY/MM/DD'));
      this.dato4 = 'Dimension';

    }else{ // Si escoge Bungalow como alojamiento
      this.tipos = 'bungalow';
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
        console.log(data);
        this.arrayCaract2 = data;
        Object.keys(data[0]).forEach(key => { // Para sacar las keys del array obtenido desde reserva.php
          this.dato3 = key; // Sin mayúscula
        });
      }
    }, error => console.log(error));
  }


  ngOnInit(): void {

    // Compruebo si hay un usuario con sesión iniciada
    this.usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

    // Formulario 1
    this.fechas = this.fb.group({
      fechaEntrada: ['', [Validators.required]],
      fechaSalida: ['', [Validators.required]],
    });


    // Formulario 2
    this.alojamiento = this.fb.group({
      tipo: ['', Validators.required],
      caracteristicaUnica1: ['', Validators.required],
      caracteristicaUnica2: ['', Validators.required],
    });


    if(this.usuarioActual != null){ // SIN UTILIDAD AUN
      //console.log(this.usuarioActual);
      let fd: any = new FormData();
      fd.append('alias', this.usuarioActual['alias']);
      fd.append('dni', this.usuarioActual['nif']);
      fd.append('nombre_usuario', this.usuarioActual['nombre']);
      fd.append('telefono', this.usuarioActual['telefono']);
      fd.append('email', this.usuarioActual['email']);
      fd.append('password', this.usuarioActual['password']);
      fd.append('rol', this.usuarioActual['rol']);
    }
    

    // Formulario 3
    this.usuario = this.fb.group({
      nombreCompleto: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', Validators.required],
      dni: ['', Validators.required],
    });
  }
}
