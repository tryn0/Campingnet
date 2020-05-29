import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

export interface Tile {
  cols: number;
  rows: number;
  src: string;
}
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  // Listado de servicios, dichos servicios, no será alojamientos, o los servicios extras de personas
  public servicios: any = [];

  /* Pendiente de poner este JSON de servicios en un PHP para no repetirlo en varios .ts */
  public servicios2 = [
    {
      texto: "Restaurante", precio: 9.95, horario: "10:00 - 23:30" /*,src: "url de la foto"*/
    },
    {
      texto: "Spa", precio: 19.90, horario: "09:00 - 20:00" /*,src: "url de la foto"*/
    },
    {
      texto: "Piscina", precio: 5.99, horario: "09:00 - 21:00" /*,src: "url de la foto"*/
    },
  ];

  // Cabecera de fotos
  public tiles: Tile[] = [
    {cols: 1, rows: 2, src: 'cielo.jpg'},
    {cols: 2, rows: 2, src: 'parcelas.jpg'},
    {cols: 1, rows: 2, src: 'aereo.jpg'},
  ];

  constructor(private http: HttpClient) {
    this.http.get('http://34.206.59.221/servicios.php').subscribe(data => {
      if(data != null && data != 0) {
        this.servicios = data;
      }
    }, error => console.log(error));
  }

  ngOnInit(): void { }
}
