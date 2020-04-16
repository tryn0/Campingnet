import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-noencontrado',
  templateUrl: './noencontrado.component.html',
  styleUrls: ['./noencontrado.component.css']
})
export class NoencontradoComponent implements OnInit {

  constructor(){}

  volver(){ // Función para volver atrás en el historial
    history.back();
  }

  ngOnInit(): void {}

}
