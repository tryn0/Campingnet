import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Usuario } from '../usuario/usuario';
import { Router } from "@angular/router";

import { encriptar, desencriptar } from '../crypto-storage';

/**
 * Componente Login
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  /**
   * Variable con el usuario actual
   */
  public userdata: string ;

  /**
   * Variable con el FormGroup (Formulario)
   */
  public login: FormGroup;

  /**
   * Variable que comprueba si el usuario a iniciar sesión existe
   */
  public existe: any = null;

  /**
   * Variable que controla la vista
   */
  public comprobado: string;

  /**
   * Objeto usuario
   */
  public usuario: Usuario;

  /**
   * Constructor de login
   * @param http 
   * @param fb 
   * @param router 
   */
  constructor(private http: HttpClient, public fb: FormBuilder, private router: Router) {
    if (this.userdata == null) {
      if(localStorage.getItem('usuarioActual') != null){
        this.userdata = desencriptar(localStorage.getItem('usuarioActual'));
      }
    }

    this.login = this.fb.group({
      email: ['', [Validators.required]],
      password: ['',  Validators.required],
    });

  }

  /**
   * Función para mandar los datos introducidos (email y contraseña) al archivo login-usuario.php y comprobar si existe el usuario
   */
  LogIn(){
    if(this.login.get('email').value != null && this.login.get('password').value != null){
      this.comprobado = null;
      let fd: any = new FormData();
      fd.append('email', this.login.get('email').value);
      fd.append('password', this.login.get('password').value);

      this.http.post<any>('http://34.206.59.221/login-usuario.php', fd).subscribe(data =>{
        if(data != null){ // Si encuentra el usuario y la pass coincide
          if(data != 0){
            this.comprobado = 'true';
            this.existe = data[0];
            this.crearUsuario();
          }else{
            this.comprobado = 'false';
          }
        }else{ // No se encuentra el usuario o la pass no coincide
          this.comprobado = 'false';
        }
      }, error => console.log(error));
    }
    
  }

  /**
   * Función para creal la sesión del usuario
   */
  crearUsuario(){
    if(this.existe != null){
      // Si el usuario está en la BD (coincide email y pass) creo usuario y lo guardo localmente para mantener sesión iniciada
      this.usuario = new Usuario(this.existe.idUsuario, this.existe.email, this.existe.nif_usuario, this.existe.nombre_usuario, this.existe.rol, this.existe.telefono, this.existe.alias_usuario);
      
      localStorage.setItem('usuarioActual',encriptar(this.usuario));

      // Redirijo a la misma página pero como tendrá sesión iniciada aparecerá el elemento de carga y al acabar redigirá a Inicio
      this.router.navigate(['/login']);
      window.location.reload();
    }
  }

  /**
   * Función para volver atrás en el historial del navegador
   */
  volver(){
    history.back();
  }

  /**
   * Al empezar a iniciar el archivo .ts
   */
  ngOnInit(): void {
    // Si hay una sesión iniciada redirige a Inicio
    if(this.userdata != null){
      window.history.back();
    }
  }
}
