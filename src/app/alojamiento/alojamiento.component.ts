import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Alojamiento } from "./alojamiento";

@Component({
  selector: 'app-alojamiento',
  templateUrl: './alojamiento.component.html',
  styleUrls: ['./alojamiento.component.css']
})
export class AlojamientoComponent implements OnInit {

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

  constructor(private router: ActivatedRoute, private http: HttpClient, private route: Router) {
    
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
              const element = this.alojamientos[i];
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
        if(data != null){ // Si encuentra alojamientos...
          this.alojamientos = data[0];
          if(this.alojamientos != 0){ // Si la consulta no devuelve 0 
            if(this.alojamiento == 'bungalows'){
              // Bungalows
              this.errorExiste = null;
              this.bungalows = null;
              const element = this.alojamientos;
              this.bungalows = new Alojamiento(element.idAlojamiento, element.tipo, element.numeroAlojamiento, null, null, element.habitaciones, element.maximo_personas);
              this.arrayBungalows.push(this.bungalows);
            }else if(this.alojamiento == 'parcelas'){
              // Parcelas
              this.errorExiste = null;
              this.parcelas = null;
              const element = this.alojamientos;
              this.parcelas = new Alojamiento(element.idAlojamiento, element.tipo, element.numeroAlojamiento, element.sombra, element.dimension, null, null);
              this.arrayParcelas.push(this.parcelas);
            }
          }else{
            this.errorExiste = true;
          }
        }
      }, error => console.log(error));


    }else{ // Si la url es /alojamiento/ y el 2º parámetro no existe que se redirija a /inicio
      this.route.navigate(['/inicio']);
    }
  }

  volver(){ // Función para volver atrás en el historial
    history.back();
  }

  ngOnInit(): void {
  }
}