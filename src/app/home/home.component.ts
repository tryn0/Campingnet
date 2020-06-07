import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente Home
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  /**
   * Variable para el control de mostrar eventos
   */
  public mostrarEventos: boolean = false;

  /**
   * Constructor de Home
   */
  constructor() {}

  /**
   * JSON con las diapositivas del carrusel
   */
  public slides = [
    {
      src: "assets/images/carrusel/bienvenida.jpg", alt: "Playa de bienvenida", texto: "Te damos la bienvenida"
    },
    {
      src: "assets/images/carrusel/bungalows.jpg", alt: "Nuestros bungalows", texto: "Conozca nuestros bungalows", link: "/alojamiento/bungalows"
    },
    {
      src: "assets/images/carrusel/parcelas.jpg", alt: "Nuestras parcelas", texto: "Conozca nuestras parcelas", link: "/alojamiento/parcelas"
    },
    {
      src: "assets/images/carrusel/cortijo-fraile.jpg", alt: "Cortijo del Fraile, Almería", texto: "Cortijo del Fraile"
    },
  ];

  /**
   * JSON con los servicios
   */
  public servicios = [
    {
      texto: "Reparto de comida al alojamiento", precio: 1.99, horario: "13:00 - 23:00"
    },
    {
      texto: "Ruta en piragüa por la playa", precio: 14.95, horario: "16:00 - 20:00"
    },
    {
      texto: "Alquiler de bicicletas", precio: 9.99, horario: "09:00 - 21:00"
    },
    {
      texto: "Buceo por la playa", precio: 6.99, horario: "10:00 - 20:00"
    },
  ];

  /**
   * JSON con los datos de los alrededores
   */
  public alrededores = [
    {
      informacion: "Minas de Rodalquilar, ruta por las auténticas minas de Rodalquilar, Almería."
    },
    {
      informacion: "Discotecas en la playa, para que los adultos pasen una buena noche."
    },
    {
      informacion: "Volcán, visita y ruta por el volcán de Cabo de Gata."
    },
    {
      informacion: "Visita los pueblos de los alrededores, El Pozo de los Frailes, San José, Rodalquilar, Las Negras, La Isleta del Moro, Aguamarga, etc."
    },
    {
      informacion: "Visita de Almería Capital, Campohermoso, para productos básicos que no encuentres en la tienda del camping, como combustible para su vehículo, comida especial (sin gluten o sin lactosa), etc."
    },
    {
      informacion: "Visita al Cortijo del Fraile, lugar de Bodas de Sangre, adaptada por Federico García Lorca."
    },
  ];

  /**
   * JSON con los datos de eventos
   */
  public listaEventos = [
    {
      evento: "Campeonato de futbol", info: "Cada domingo a las 18:00 se realizará un campeonato de futbol en las pistas de futbol y baloncesto."
    },
    {
      evento: "Campeonato de padel", info: "Cada sábado a las 18:00, se realizará un campeonato de padel en la pista de padel."
    },
    {
      evento: "Partido de aquabasket", info: "Cada día a las 17:00 se realizará un partido de aquabasket en la piscina."
    },
    {
      evento: "Animación", info: "Cada día habrá animación de 11:00 - 14:00, 17:00 - 19:00 y 22:00 - 00:00"
    },
  ];

  /**
   * Función para mostrar la vista de los eventos
   */
  eventos() {
    this.mostrarEventos = true;
  }

  /**
   * Función para ocultar la vista de los eventos
   */
  atrasEventos() {
    this.mostrarEventos = false;
  }

  /**
   * Al empezar a cargar el archivo .ts
   */
  ngOnInit(): void {}

}