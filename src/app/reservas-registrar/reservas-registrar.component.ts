import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Usuario } from '../usuario/usuario';

import { encriptar, desencriptar } from '../crypto-storage';
import { MustMatch } from '../must-match.validator';

/**
 * Interfaz DialogData
 */
interface DialogData {
  /**
   * Dato email del usuario a registrarse para reservar
   */
  email: string;
}

/**
 * Componente reservas-registrar
 */
@Component({
  selector: 'app-reservas-registrar',
  templateUrl: './reservas-registrar.component.html',
  styleUrls: ['./reservas-registrar.component.css']
})
export class ReservasRegistrarComponent implements OnInit {

  /**
   * Variable con los datos del usuario con sesión iniciada
   */
  public userdata: string;

  /**
   * Formulario de registro
   */
  public registro: FormGroup;

  /**
   * Variable que controla si se ha registrado o no
   */
  public registrado: string;

  /**
   * Objeto usuario
   */
  public usuario: Usuario;

  /**
   * Variables para los errores del formulario
   */
  public aliasVal: boolean = null;
  /**
   * Variables para los errores del formulario
   */
  public dniVal: boolean = null;
  /**
   * Variables para los errores del formulario
   */
  public nombreVal: boolean = null;
  /**
   * Variables para los errores del formulario
   */
  public telVal: boolean = null;
  /**
   * Variables para los errores del formulario
   */
  public emailVal: boolean = null;
  /**
   * Variables para los errores del formulario
   */
  public passVal: boolean = null;
  /**
   * Variables para los errores del formulario
   */
  public pass2Val: boolean = null;

  /**
   * Variables de error
   */
  public errorEmail: boolean = null;
  /**
   * Variables de error
   */
  public errorDni: boolean = null;
  /**
   * Variables de error
   */
  public errorAlias: boolean = null;

  /**
   * Constructor de reservas-registrar
   * @param dialogRef
   * @param data 
   * @param fb 
   * @param http 
   */
  constructor(public dialogRef: MatDialogRef<ReservasRegistrarComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private fb: FormBuilder, private http: HttpClient) {
    this.registro = this.fb.group({
      alias: ['', [Validators.required, Validators.maxLength(25)]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8,8}[A-Za-z]$')]],
      nombreCompleto: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[6-7][0-9]{8}$')]],
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)$")]],
      password: ['', [Validators.minLength(8), Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')]],
      password2: ['',  Validators.required],
    }, {validator: MustMatch('password', 'password2')});
  }

  /**
   * Función para registrar al usuario
   */
  signIn(){
    if (!this.registro.get('alias').hasError('required') && !this.registro.get('alias').hasError('maxlength')) {
      this.aliasVal = true;
      if (!this.registro.get('dni').hasError('required') && !this.registro.get('dni').hasError('pattern')) {
        this.dniVal = true;
        if (!this.registro.get('nombreCompleto').hasError('required')) {
          this.nombreVal = true;
          if (!this.registro.get('telefono').hasError('required') && !this.registro.get('telefono').hasError('pattern')) {
            this.telVal = true;
            if (!this.registro.get('email').hasError('required') && !this.registro.get('email').hasError('pattern')) {
              this.emailVal = true;
              if (!this.registro.get('password').hasError('required') && !this.registro.get('password').hasError('pattern')) {
                this.passVal = true;
                if (!this.registro.get('password2').errors) {
                  this.pass2Val = true;
                  this.registrado = null;

                  //Para cambiar primera letra de nombre y cada apellido en mayúscula
                  var nombreUser = '';
                  for (let indice = 0; indice < this.registro.get('nombreCompleto').value.split(/\s+/).length; indice++) {
                    const element = this.registro.get('nombreCompleto').value.split(/\s+/)[indice];
                    if (element.length > 0) {
                      nombreUser += element[0].toUpperCase() + element.slice(1) + ' ';
                    }
                  }

                  //Letra del DNI en mayúscula
                  let dniUser = this.registro.get('dni').value.slice(0, this.registro.get('dni').value.length - 1) + this.registro.get('dni').value[this.registro.get('dni').value.length - 1].toUpperCase();

                  //Preparación de variables del formulario para enviar a la BD a través de PHP
                  let fd: any = new FormData();
                  fd.append('alias', this.registro.get('alias').value);
                  fd.append('dni', dniUser);
                  fd.append('nombre_usuario', nombreUser);
                  fd.append('telefono', this.registro.get('telefono').value);
                  fd.append('email', this.registro.get('email').value);
                  fd.append('password', this.registro.get('password').value);

                  //Envío de variables a archivo PHP
                  this.http.post < any > ('http://34.206.59.221/registro-usuario.php', fd).subscribe(data => {
                     if(data == 'email'){ //Si no se pudo registrar el usuario (dni, telefono o email repetido u otro error ajeno a los datos)
                      this.registrado = 'false';
                      this.errorEmail = true;
                    } else if(data == 'dni'){
                      this.registrado = 'false';
                      this.errorDni = true;
                    } else if(data == 'alias'){
                      this.registrado = 'false';
                      this.errorAlias = true;
                    }else{ // El registro ha ido bien (no existia en la BD un usuario con mismo DNI, teléfono o email)
                      // Creacion del usuario, sino hace falta eliminar esta parte, aunque lo tengo para mostrar el nombre de Bienvenida y crear la sesión de sesion iniciada
                      this.usuario = new Usuario(data[0].idUsuario, this.registro.get('email').value, dniUser, nombreUser, 'cliente', this.registro.get('telefono').value, this.registro.get('alias').value);
                      this.registrado = 'true';
                      this.errorEmail = null;
                      this.errorDni = null;
                      this.errorAlias = null;
                      localStorage.setItem('usuarioActual',encriptar(this.usuario));
                      this.dialogRef.close(this.usuario);
                    }
                  }, error => console.log(error));
                } else { // Si el campo password2 (confirmación de contraseña) tiene algún error (requerido o no coincide con password)
                  this.pass2Val = false;
                }
              } else { //Si el campo password (contraseña) tiene algún error (requerido o no contiene carácteres necesarios)
                this.passVal = false;
              }
            } else { //Si el campo email tiene algún error (requerido o patrón) patrón aun no funciona
              this.emailVal = false;
            }
          } else { //Si el campo teléfono tiene algún error (requerido o patrón [9 dígitos, empieza por 6 o 7])
            this.telVal = false;
          }
        } else { //Si el campo nombre y apellidos tiene algún error (requerido)
          this.nombreVal = false;
        }
      } else { //Si el campo DNI tiene algún error (requerido y 8 dígitos con una letra al final)
        this.dniVal = false;
      }
    }else { // Si el campo alias tiene algún error (requerido)
      this.aliasVal = false;
    }
  }

  /**
   * Al empezar a cargar el archivo .ts
   */
  ngOnInit(): void {
    if(localStorage.getItem('usuarioActual') != null){
      this.userdata = desencriptar(localStorage.getItem('usuarioActual'));
    }
    if(this.userdata != null){
      window.history.back();
    }
  }
}