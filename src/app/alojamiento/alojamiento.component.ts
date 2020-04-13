import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Component({
  selector: 'app-alojamiento',
  templateUrl: './alojamiento.component.html',
  styleUrls: ['./alojamiento.component.css']
})
export class AlojamientoComponent implements OnInit {

  public alojamiento: string = null;

  public situacion: number;

  constructor(private router: ActivatedRoute, private http: HttpClient, private route: Router) {
    
    if(this.router.snapshot.url.length == 1 && this.router.snapshot.url[0].path == 'alojamiento'){ // Si la url solo tiene 1 parámetro y es alojamiento que muestre una página para vefr parcelas o bungalows (para asegurarme de que va bien)
      this.situacion = 0;
    }else if(this.router.snapshot.url[1].path == 'bungalows' || this.router.snapshot.url[1].path == 'parcelas'){ // Si hay 2 parámetros y es bungalows o parcelas que vaya al archivo php y busque en la BD
      this.situacion = 1;
      this.alojamiento = this.router.snapshot.url[1].path; // 2º parámetro (parcelas o bungalows)

      this.http.post<string>('http://localhost/alojamientos.php', this.alojamiento).subscribe(data =>{ // Inicia el archivo alojamientos.php y busca en la BD los alojamientos con tipo según el 2º parámetro
        if(data != null){ // Si encuentra alojamientos...
          console.log(data);
        }
      }, error => console.log(error));

    }else{ // Si la url es /alojamiento/ y el 2º parámetro no existe que se redirija a /inicio
      this.route.navigate(['/inicio']);
    }
     

    
  }

  ngOnInit(): void {
  }

}
