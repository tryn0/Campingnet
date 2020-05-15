import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-noencontrado',
  templateUrl: './noencontrado.component.html',
  styleUrls: ['./noencontrado.component.css']
})
export class NoencontradoComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router){}

  volver(){ // Función para volver atrás en el historial
    history.back();
  }

  ngOnInit(): void {
    if(this.route.snapshot.url[0].path.toLowerCase() !== this.route.snapshot.url[0].path){
      this.router.navigate([this.route.snapshot.url[0].path.toLowerCase()]);
    }
  }
}
