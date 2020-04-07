import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Usuario } from '../usuario/usuario';
import { Router } from "@angular/router";

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {

  public userdata: string;

  public registro: FormGroup;

  constructor(public fb: FormBuilder, private router: Router) {
    this.userdata = localStorage.getItem('usuarioActual');

    this.registro = this.fb.group({
      //alias: ['', Validators.required],
      dni: ['', Validators.required],
      nombreCompleto: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required]],
      password: ['', [Validators.minLength(3), Validators.required]],
      password2: ['', [Validators.minLength(3), Validators.required]],
    });
   }

   registrar(){
     console.log(this.registro);
   }
  ngOnInit(): void {
    if(this.userdata != null){
      this.router.navigate(['/']);
    }
  }

}
//Queda hacer la parte de unir este formulario con base de datos (php) y las validaciones del formulario repetir contraseñas, patrón del DNI y del correo (SINO con las validaciones del HTML como tel email etc)