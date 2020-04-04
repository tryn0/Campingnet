import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  parcelas = [];
  bungalows = [];

  userdata = [];

  constructor(private http: HttpClient) {

  }

  public slides = [
    {
      src: "assets/images/carrusel/bienvenida.jpg", alt: "Playa de bienvenida", texto: "Te damos la bienvenida"
    },
    {
      src: "assets/images/carrusel/imagen2.jpg", alt: "Diapositiva 1 con bungalows", texto: "Conozca nuestros bungalows", link: "/alojamiento:bungalows"
    },
    {
      src: "assets/images/carrusel/imagen2.jpg", alt: "Bungalows", texto: "prueba"
    },
  ];

  public servicios = [
    {
      texto: "Servicio 1", precio: 3.50, horario: "10:00" /*,src: "url de la foto"*/
    },
    {
      texto: "servicio 2", precio: 19.90, horario: "17:00"
    },
    {
      texto: "servicio 3", precio: 5.99, horario: "21:00"
    },
  ];

  public alrededores = [
    {
      informacion: "información 1"
    },
    {
      informacion: "información 2"
    },
    {
      informacion: "información 3"
    },
  ];

  ngOnInit(): void {
  }

}