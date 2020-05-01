import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Alojamiento } from "./alojamiento";

@Component({
  selector: 'app-alojamiento',
  templateUrl: './alojamiento.component.html',
  styleUrls: ['./alojamiento.component.css']
})
export class AlojamientoComponent implements OnInit {

  public usuarioActual: any;

  public alojamiento: string = null;

  public situacion: number;

  public alojamientos: any;

  public numero: number;

  public errorExiste: boolean = null;

  // Variables de listado de alojamientos
  public arrayBungalows: Alojamiento[] = [];
  public arrayParcelas: Alojamiento[] = [];

  // Definición de variables como objetos Alojamiento para bungalows y parcelas 
  public bungalows: Alojamiento;
  public parcelas: Alojamiento;

  /*public bungalow: Alojamiento;
  public parcela: Alojamiento;*/
  public alojamientoSeleccionado: Alojamiento;

  // Reseñas
  public reseñas: any;
  public resenia: FormGroup;
  public anonimoCheck: boolean = false;

  constructor(private router: ActivatedRoute, private http: HttpClient, public fb: FormBuilder, private route: Router) {
    
    if(this.router.snapshot.url.length == 1 && this.router.snapshot.url[0].path == 'alojamiento'){ // Si la url solo tiene 1 parámetro y es alojamiento que muestre una página para vefr parcelas o bungalows (para asegurarme de que va bien)
      this.situacion = 0;

      // Parámetros a enviar al archivo PHP
      let params = new HttpParams()
      .set('alojamiento', '')
      .set('numero', '0');
      
      this.http.post('http://localhost/alojamientos.php', params).subscribe(data =>{ // Inicia el archivo alojamientos.php y busca en la BD los alojamientos con tipo según el 2º parámetro
        if(data != null){ // Si encuentra alojamientos...
          this.alojamientos = data;

          // Bungalows
          for (let i = 0; i < this.alojamientos['bungalows'].length; i++) {
            this.bungalows = null;
            const element = this.alojamientos['bungalows'][i];
            this.bungalows = new Alojamiento(element.idAlojamiento, element.tipo, element.numeroAlojamiento, null, null, element.habitaciones, element.maximo_personas);
            this.arrayBungalows.push(this.bungalows);
          }

          // Parcelas
          for (let i = 0; i < this.alojamientos['parcelas'].length; i++) {
            this.parcelas = null;
            const element = this.alojamientos['parcelas'][i];
            this.parcelas = new Alojamiento(element.idAlojamiento, element.tipo, element.numeroAlojamiento, element.sombra, element.dimension, null, null);
            this.arrayParcelas.push(this.parcelas);
          }
        }
      }, error => console.log(error));

    }else if(this.router.snapshot.url.length == 2 && (this.router.snapshot.url[1].path == 'bungalows' || this.router.snapshot.url[1].path == 'parcelas')){ // Si hay 2 parámetros y es bungalows o parcelas que vaya al archivo php y busque en la BD
      this.situacion = 1;
      this.alojamiento = this.router.snapshot.url[1].path; // 2º parámetro (parcelas o bungalows)

      // Parámetros a enviar al archivo PHP
      let params = new HttpParams()
      .set('alojamiento', this.alojamiento)
      .set('numero', '0');


      this.http.post<string>('http://localhost/alojamientos.php', params).subscribe(data =>{ // Inicia el archivo alojamientos.php y busca en la BD los alojamientos con tipo según el 2º parámetro
        if(data != null){ // Si encuentra alojamientos...
          this.alojamientos = data;
          if(this.alojamiento == 'bungalows'){
            // Bungalows
            for (let i = 0; i < this.alojamientos.length; i++) {
              this.bungalows = null;
              const element = this.alojamientos[0];
              this.bungalows = new Alojamiento(element.idAlojamiento, element.tipo, element.numeroAlojamiento, null, null, element.habitaciones, element.maximo_personas);
              this.arrayBungalows.push(this.bungalows);


            }
          }else if(this.alojamiento == 'parcelas'){
            // Parcelas
            for (let i = 0; i < this.alojamientos.length; i++) {
              this.parcelas = null;
              const element = this.alojamientos[i];
              this.parcelas = new Alojamiento(element.idAlojamiento, element.tipo, element.numeroAlojamiento, element.sombra, element.dimension, null, null);
              this.arrayParcelas.push(this.parcelas);
            }
          }
        }
      }, error => console.log(error));

      // Si entra con URL con longitud de 3 (/alojamiento/parcelas/3, por ejemplo) el 2º path de la URL es bungalows o parcelas y existe el parámetro id
    }else if(this.router.snapshot.url.length == 3 && (this.router.snapshot.url[1].path == 'bungalows' || this.router.snapshot.url[1].path == 'parcelas') && this.router.snapshot.params.numero){ 
      this.numero = this.router.snapshot.params.numero;

      this.situacion = 2;
      this.alojamiento = this.router.snapshot.url[1].path; // 2º parámetro (parcelas o bungalows)

      // Parámetros a enviar al archivo PHP
      let params = new HttpParams()
      .set('alojamiento', this.alojamiento)
      .set('numero', this.router.snapshot.params.numero);

      this.http.post<string>('http://localhost/alojamientos.php', params).subscribe(data =>{ // Inicia el archivo alojamientos.php y busca en la BD los alojamientos con tipo según el 2º parámetro

        if(data != null){ // Si encuentra algo
          if(data == '0'){ // Si devuelve 0, error

            this.errorExiste = true;

          }else{ // si no...

            this.alojamientos = data[0];
            if(this.alojamientos != 0){ // Si la consulta no devuelve 0 

              this.errorExiste = null;
              if(this.alojamiento == 'bungalows' || this.alojamiento == 'parcelas'){ // Si el alojamiento es pacerla o bungalow
                
                const element = this.alojamientos;
                if(this.alojamiento == 'bungalows'){ // Si es bungalow creo un Alojamiento con los datos del bungalow
                  this.alojamientoSeleccionado = new Alojamiento(element.idAlojamiento, element.tipo, element.numeroAlojamiento, null, null, element.habitaciones, element.maximo_personas);

                }else{ // Si es parcela creo un Alojamiento con los datos de la parcela
                  this.alojamientoSeleccionado = new Alojamiento(element.idAlojamiento, element.tipo, element.numeroAlojamiento, element.sombra, element.dimension, null, null);
                }

              }

            }else{ // Si no encuentra en la base de datos los datos de la URL (/alojamiento/bungalows/99) significa que no existe ese alojamiento
              this.errorExiste = true;
            }

          }

        }

      }, error => console.log(error));

       // Parámetros a enviar al archivo PHP
       let paramResenias = new HttpParams()
       .set('numero', this.router.snapshot.params.numero);
       
       /**
        * TODO: Es post de aqui abajo devuelve todas las reseñas del alojamiento, pero devuelve los datos sin el nombre de usuario, 
        */
        this.http.post('http://localhost/resenias.php', paramResenias).subscribe(data =>{ // Recopilar reseñas
          if(data != null){ // Si existen reseñas...
            this.reseñas = data;
            for (let i = 0; i < this.reseñas.length; i++) {
              const element = this.reseñas[i];

              if(element['anonimo'] == '0'){
                // si es anonimo no mostrarlo
              }
              
            }
          }
        }, error => console.log(error));


    }else{ // Si la url es /alojamiento/ y el 2º parámetro no existe que se redirija a /inicio
      this.route.navigate(['/inicio']);
    }
  }

  anonimo(e){

    this.anonimoCheck = e.checked;
    //console.log(this.anonimoCheck);
  }

  enviarResenia(){}

  ngOnInit(): void {

    // Comprobar que hay una sesion de usuario
    this.usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

    this.resenia = this.fb.group({
      anonimo: ['',  Validators.required],
      mensaje: ['', Validators.required],
      puntuacion: ['', Validators.required]
    });

  }
}