import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {

  // Variable de sesión iniciada
  public usuarioActual: string;


  // Bloqueo del formulario
  public isLinear: boolean = true;


  // Variables del formulario 1
  public alojamiento: FormGroup;
  public tipos: any;
  public tipos2: any = [];
  public dato1: string;
  public dato2: string = 'Sombra o habitaciones';
  public arrayCaract1: any = [];
  

  // Variables del formulario 2
  public usuario: FormGroup;


  // Variables del formualrio 3
  public fechas: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  getDatos(datos: string){
    //console.log(datos);

    // Parámetros a enviar al archivo PHP
    let params: any;

    if(datos == 'Parcela'){ // Si escoge Parcela como alojamiento

      params = new HttpParams()
      .set('opcion', '2');

    }else{ // Si escoge Bungalow como alojamiento
      params = new HttpParams()
      .set('opcion', '3');

    }
    
    // Petición POST para obtener todos los tipos de alojamieto
    this.http.post('http://localhost/reserva.php', params).subscribe(data =>{
      if(data != null){ // Si recibe algún alojamiento
        this.arrayCaract1 = data;
        console.log(this.arrayCaract1[0]['habitaciones']);
        Object.keys(data[0]).forEach(key => {
          this.dato1 = key;
          this.dato2 = key[0].toUpperCase()+key.slice(1);
      });
      }
    }, error => console.log(error));

  }
  ngOnInit(): void {

    // Compruebo si hay un usuario con sesión iniciada
    this.usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

    // Parámetros a enviar al archivo PHP
    let params = new HttpParams()
    .set('opcion', '1');

    // Petición POST para obtener todos los tipos de alojamieto
    this.http.post('http://localhost/reserva.php', params).subscribe(data =>{
      if(data != null){ // Si recibe algún alojamiento
        this.tipos = data;
        for (let i = 0; i < this.tipos.length; i++) { // Esto es solo para cambiar la primera letra a mayúscula
          const element = this.tipos[i]['tipo'][0].toUpperCase()+this.tipos[i]['tipo'].slice(1);
          this.tipos2.push(element);
        }
      }
    }, error => console.log(error));

    // Formulario 1
    this.alojamiento = this.fb.group({
      tipo: ['', Validators.required],
      caracteristicaUnica1: ['', Validators.required],
    });


    if(this.usuarioActual != null){
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
    

    // Formulario 2
    this.usuario = this.fb.group({
      nombreCompleto: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', Validators.required],
      dni: ['', Validators.required],
    });

    this.fechas = this.fb.group({
      fechaEntrada: ['', Validators.required],
      fechaSalida: ['', Validators.required],
    });

  }

}
