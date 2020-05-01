import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Usuario } from '../usuario/usuario';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public userdata: string;

  public login: FormGroup;

  public existe: any;

  public comprobado: string;

  public usuario: Usuario;


  constructor(private http: HttpClient, public fb: FormBuilder, private router: Router) {
    this.userdata = localStorage.getItem('usuarioActual');

    this.login = this.fb.group({
      email: ['', [Validators.required]],
      password: ['',  Validators.required],
    });

  }

  // Función para mandar los datos introducidos (email y contraseña) al archivo login-usuario.php y comprobar si existe el usuario
  LogIn(){
    this.comprobado = null;
    let fd: any = new FormData();
    fd.append('email', this.login.get('email').value);
    fd.append('password', this.login.get('password').value);

    this.http.post<any>('http://localhost/login-usuario.php', fd).subscribe(data =>{
      if(data != null){ // Si encuentra el usuario y la pass coincide
        this.comprobado = 'true';
        this.existe = data[0];
        this.crearUsuario();
      }else{ // No se encuentra el usuario o la pass no coincide
        this.comprobado = 'false';
      }
    }, error => console.log(error)
    );
  }

  crearUsuario(){
    if(this.existe != null){
      // Si el usuario está en la BD (coincide email y pass) creo usuario y lo guardo localmente para mantener sesión iniciada
      this.usuario = new Usuario(this.existe.idUsuario, this.existe.email, this.existe.nif_usuario, this.existe.nombre_usuario, this.existe.rol, this.existe.telefono, this.existe.alias_usuario);
      localStorage.setItem('usuarioActual',JSON.stringify(this.usuario));
      // Redirijo a la misma página pero como tendrá sesión iniciada aparecerá el elemento de carga y al acabar redigirá a Inicio
      this.router.navigate(['/login']);
      window.location.reload();
    }
  }

  volver(){
    history.back();
  }

  ngOnInit(): void {
    // Si hay una sesión iniciada redirige a Inicio
    if(this.userdata != null){
      //this.router.navigate(['/']);
      window.history.back();
    }
  }

}
