import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Componente no encontrado
 */
@Component({
  selector: 'app-noencontrado',
  templateUrl: './noencontrado.component.html',
  styleUrls: ['./noencontrado.component.css']
})
export class NoencontradoComponent implements OnInit {

  /**
   * Constructor de no encontrado
   * @param route 
   * @param router 
   */
  constructor(private route: ActivatedRoute, private router: Router){}

  /**
   * Función para volver atrás en el historial del navegador
   */
  volver(){
    history.back();
  }

  /**
   * Al empezar a cargar el archivo .ts
   */
  ngOnInit(): void {
    if(this.route.snapshot.url[0].path.toLowerCase() !== this.route.snapshot.url[0].path){
      this.router.navigate([this.route.snapshot.url[0].path.toLowerCase()]);
    }
  }
}
