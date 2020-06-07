import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Usuario } from '../usuario/usuario';

import { encriptar, desencriptar } from '../crypto-storage';

/**
 * Interfaz DialogData
 */
interface DialogData {
  /**
   * Dato email del usuario a iniciar sesión para reservar
   */
  email: string;
}

/**
 * Componente reservas-login
 */
@Component({
  selector: 'app-reservas-login',
  templateUrl: './reservas-login.component.html',
  styleUrls: ['./reservas-login.component.css']
})
export class ReservasLoginComponent implements OnInit {

  /**
   * Booleano para controlar si existe el usuario o coincide con la BD
   */
  public comprobado: boolean = null;

  /**
   * Formulario para el inicio de sesión
   */
  public login: FormGroup;

  /**
   * Variable si encuentra al usuario a iniciar sesión
   */
  public existe: any;

  /**
   * Objeto usuario
   */
  public usuario: Usuario;

  /**
   * Constructor de reservas-login
   * @param dialogRef 
   * @param data 
   * @param fb 
   * @param http 
   */
  constructor(public dialogRef: MatDialogRef<ReservasLoginComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private fb: FormBuilder, private http: HttpClient) {
    this.login = this.fb.group({
      email: ['', [Validators.required]],
      password: ['',  Validators.required],
    });
  }

  /**
   * Formulario para iniciar sesión
   */
  LogIn(){
    let fd: any = new FormData();
    fd.append('email', this.login.get('email').value);
    fd.append('password', this.login.get('password').value);

    this.http.post<any>('http://34.206.59.221/login-usuario.php', fd).subscribe(data =>{
      if(data != 0){ // Si encuentra el usuario y la pass coincide
        this.existe = data[0];
        this.usuario = new Usuario(this.existe.idUsuario, this.existe.email, this.existe.nif_usuario, this.existe.nombre_usuario, this.existe.rol, this.existe.telefono, this.existe.alias_usuario);
        localStorage.setItem('usuarioActual',encriptar(this.usuario));
        this.dialogRef.close(this.usuario);
      }else{ // No se encuentra el usuario o la pass no coincide
        this.comprobado = false;
      }
    }, error => console.log(error)
    );
  }

  /**
   * Al empezar a cargar el archivo .ts
   */
  ngOnInit() {}
}