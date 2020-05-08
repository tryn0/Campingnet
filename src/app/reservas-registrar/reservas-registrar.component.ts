import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Usuario } from '../usuario/usuario';

import { encriptar, desencriptar } from '../crypto-storage';
import { MustMatch } from '../must-match.validator';

interface DialogData {
  email: string;
}

@Component({
  selector: 'app-reservas-registrar',
  templateUrl: './reservas-registrar.component.html',
  styleUrls: ['./reservas-registrar.component.css']
})
export class ReservasRegistrarComponent implements OnInit {

  public userdata: string;

  public registro: FormGroup;

  public registrado: string;

  public usuario: Usuario;

  public registerUser: string;

  public validacionForm: boolean = false;

  public nombre: string;

  /*Variables para los errores del formulario*/
  public aliasVal: boolean = null;
  public dniVal: boolean = null;
  public nombreVal: boolean = null;
  public telVal: boolean = null;
  public emailVal: boolean = null;
  public passVal: boolean = null;
  public pass2Val: boolean = null;

  public errorEmail: boolean = null;
  public errorDni: boolean = null;
  public errorAlias: boolean = null;
  router: any;

  constructor(public dialogRef: MatDialogRef<ReservasRegistrarComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private fb: FormBuilder, private http: HttpClient) {

    this.registro = this.fb.group({
      alias: ['', [Validators.required, Validators.maxLength(25)]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8,8}[A-Za-z]$')]],
      nombreCompleto: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[6-7][0-9]{8}$')]],
      //FALLA email
      //email: ['', [Validators.required, Validators.pattern("^(((\.)+)?[A-z0-9]+((\.)+)?)+@(((\.)+)?[A-z0-9]+((\.)+)?)+\.[A-z]+$")]],//Puede empezar por . o no, contener letras y numeros seguidos de punto o no, seguido por @ seguido por . o no letras y numeros y punto o no . letras
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)$")]],
      password: ['', [Validators.minLength(8), Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')]],
      password2: ['',  Validators.required],
    }, {validator: MustMatch('password', 'password2')});

  }

  /*LogIn(){
    let fd: any = new FormData();
    fd.append('email', this.login.get('email').value);
    fd.append('password', this.login.get('password').value);

    this.http.post<any>('http://localhost/login-usuario.php', fd).subscribe(data =>{
      if(data != 0){ // Si encuentra el usuario y la pass coincide
        this.existe = data[0];
        console.log(data)
        this.usuario = new Usuario(this.existe.idUsuario, this.existe.email, this.existe.nif_usuario, this.existe.nombre_usuario, this.existe.rol, this.existe.telefono, this.existe.alias_usuario);
        
        localStorage.setItem('usuarioActual',encriptar(this.usuario));

        this.dialogRef.close(this.usuario);
      }else{ // No se encuentra el usuario o la pass no coincide
        this.comprobado = false;
      }
    }, error => console.log(error)
    );
  }*/

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
                  this.http.post < any > ('http://localhost/registro-usuario.php', fd).subscribe(data => {
                    //console.log(data);
                     if(data == 'email'){ //Si no se pudo registrar el usuario (dni, telefono o email repetido u otro error ajeno a los datos)

                      this.registrado = 'false';
                      this.errorEmail = true;
                      //console.log(data);

                    } else if(data == 'dni'){

                      this.registrado = 'false';
                      this.errorDni = true;
                      //console.log(data);

                    } else if(data == 'alias'){

                      this.registrado = 'false';
                      this.errorAlias = true;
                      //console.log(data);

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
                  //console.log('pass2 falla');
                }
              } else { //Si el campo password (contraseña) tiene algún error (requerido o no contiene carácteres necesarios)
                this.passVal = false;
                //console.log('pass falla');
              }
            } else { //Si el campo email tiene algún error (requerido o patrón) patrón aun no funciona
              this.emailVal = false;
              //console.log('email falla');
            }
          } else { //Si el campo teléfono tiene algún error (requerido o patrón [9 dígitos, empieza por 6 o 7])
            this.telVal = false;
            //console.log('tel falla');
          }
        } else { //Si el campo nombre y apellidos tiene algún error (requerido)
          this.nombreVal = false;
          //console.log('nombre falla');
        }
      } else { //Si el campo DNI tiene algún error (requerido y 8 dígitos con una letra al final)
        this.dniVal = false;
        //console.log('dni falla');
      }
    }else { // Si el campo alias tiene algún error (requerido)
      this.aliasVal = false;
      //console.log('alias falla);
    }
  }


  ngOnInit(): void {
    if(localStorage.getItem('usuarioActual') != null){
      this.userdata = desencriptar(localStorage.getItem('usuarioActual'));
    }
    

    if(this.userdata != null){
      //this.router.navigate(['/']);
      window.history.back();
    }
  }
}