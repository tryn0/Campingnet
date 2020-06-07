import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../usuario/usuario';

import { MustMatch } from '../must-match.validator';
import {encriptar, desencriptar } from '../crypto-storage';

/**
 * Componente panel de control
 */
@Component({
  selector: 'app-panelde-control',
  templateUrl: './panelde-control.component.html',
  styleUrls: ['./panelde-control.component.css']
})
export class PaneldeControlComponent implements OnInit {

  /**
   * Formulario con los datos del usuario
   */
  public cp: FormGroup;

  /**
   * Datos del usuario con sesión iniciada
   */
  public usuarioActual: any;

  /**
   * Variable para controlar si se entra a la página de panel de control sin sesión iniciada
   */
  public noUser: boolean = null;

  /**
   * Objeto usuario
   */
  public usuario: Usuario;

  /**
   * Variable que controla cuando se ha actualizado los datos del usuario con sesión iniciada
   */
  public modificado: boolean = null;

  /**
   * Variables de errores del formulario
  */
  public errorTel: boolean = null;
  /**
   * Variables de errores del formulario
  */
  public errorEmail: boolean = null;
  /**
   * Variables de errores del formulario
  */
  public errorPass: boolean = null;
  /**
   * Variables de errores del formulario
  */
  public errorPass2: boolean = null;

  /**
   * Variables de los datos nuevos
   */
  public telefono: number = null;
  /**
   * Variables de los datos nuevos
   */
  public email: string = null;
  /**
   * Variables de los datos nuevos
   */
  public password: string = null;

  /**
   * Variables update BD
   */
  public existeEmail: boolean = null;
  /**
   * Variables update BD
   */
  public existeTel: boolean = null;
  /**
   * Variables update BD
   */
  public existeError: boolean = null;
  /**
   * Variables update BD
   */
  public updated: boolean = null;

  /**
   * Constructor de panel de control
   * @param fb 
   * @param router 
   * @param http 
   */
  constructor(public fb: FormBuilder, private router: Router, private http: HttpClient) {
    this.usuarioActual = desencriptar(localStorage.getItem('usuarioActual'));

    this.cp = this.fb.group({
      telefono: ['', [Validators.required, Validators.pattern('^[6-7][0-9]{8}$')]],
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)$")]],
      password: ['', [Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')]],
      password2: ['',],
    }, {validator: MustMatch('password', 'password2')});
  }

  /**
   * Función para cambiar los datos del usuario
   */
  cambiar(){
    // Validación del teléfono
    if(this.cp.get('telefono').value.length == 0){ // Si el teléfono está en blanco
      this.errorTel = null;
    }else{
      if(!this.cp.get('telefono').hasError('pattern')){ // Si no está en blanco y no tiene error de patrón
        this.errorTel = null;
      }else{ // Si tiene error de patrón
        this.errorTel = true;
      }
    }

    // Validación del correo
    if(this.cp.get('email').value.length == 0){ // Si el email está en blanco
      this.errorEmail = null;
    }else{
      if(!this.cp.get('email').hasError('pattern')){ // Si no está en blanco y no tiene error de patrón
        this.errorEmail = null;
      }else{ // Si tiene error de patrón
        this.errorEmail = true;
      }
    }

    // Validación de la contraseña
    if(this.cp.get('password').value.length == 0){ // Si la contraseña está en blanco
      this.errorPass = null;
    }else{
      if(!this.cp.get('password').hasError('pattern')){ // Si no está en blanco y no tiene error de patrón
        this.errorPass = null;
        if(!this.cp.get('password2').errors){ // Si la segunda contraseña no tiene errores (coinciden)
          this.errorPass2 = null;
        }else{ // Si tiene el error de no coincidencia
          this.errorPass2 = true;
        }
      }else{ // Si tiene error de patrón
        this.errorPass = true;
      }
    }

    // Comprobación de los datos nuevos
    if(this.errorTel == null && this.errorEmail == null && this.errorPass == null && this.errorPass2 == null){ // Si no hay errores en el formulario
      // Seteo los datos a null, por si se ha vuelto a clicar en guardar y se han cambiado los datos, así si los datos son iguales a los anteriores no entra en el archivo cp.php y se comunica con la BD
      this.email = null;
      this.telefono = null;
      this.password = null;
      if(this.cp.get('email').value != this.usuarioActual.email){ // Comprueba si el email ha sido cambiado
        this.email = this.cp.get('email').value;
      }

      if(this.cp.get('telefono').value != this.usuarioActual.telefono){ // Comprueba si el telefono ha sido cambiado
        this.telefono = this.cp.get('telefono').value;
      }

      if(this.cp.get('password').value.length > 0 && this.cp.get('password').value != this.usuarioActual.password){ // Comprueba si la contraseña ha sido cambiado
        this.password = this.cp.get('password').value;
      }

      if(this.email != null || this.telefono != null || this.password != null){
        let fd: any = new FormData();
        fd.append('telefono', this.telefono);
        fd.append('email', this.email);
        fd.append('password', this.password);
        fd.append('id', this.usuarioActual.id);

        this.http.post < any > ('http://34.206.59.221/cp.php', fd).subscribe(data => {
          if(data === 0){ // teléfono ya en uso
            this.existeTel = true;
          }else if(data === 1){ // email ya en uso
            this.existeEmail = true;
          }else if(data !== 0 && data !== 1){ // si no hay errores
            this.existeTel = null;
            this.existeEmail = null;
            this.existeError = null;
            this.updated = true;
            this.usuario = new Usuario(data[0].idUsuario, data[0].email, data[0].dni, data[0].nombre_usuario, data[0].rol, data[0].telefono, data[0].alias_usuario);

            // Actualización de la sesión con los datos actualizados del usuario 
            localStorage.setItem('usuarioActual', encriptar(this.usuario));
            this.modificado = true;
          }else{
            this.existeError = true;
          }
        }, error => console.log(error));
      }
    }
  }

  /**
   * Función para volver atrás en el historial del navegador
   */
  volver(){
    location.reload();
  }

  /**
   * Al empezar a cargar el archivo .ts
   */
  ngOnInit(): void {
    // Si no hay una sesión iniciada redirige a Inicio
    if(this.usuarioActual == null){
      this.noUser = true;
      this.router.navigate(['/']);
    }else{
      // Seteo de los valores predeterminados del usuario con sesión iniciada en los inputs del formulario
      this.cp.get('email').setValue(this.usuarioActual.email);
      this.cp.get('telefono').setValue(this.usuarioActual.telefono);
    }
  }
}