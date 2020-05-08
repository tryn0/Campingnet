import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Usuario } from '../usuario/usuario';

import { encriptar, desencriptar } from '../crypto-storage';

interface DialogData {
  email: string;
}

@Component({
  selector: 'app-reservas-login',
  templateUrl: './reservas-login.component.html',
  styleUrls: ['./reservas-login.component.css']
})
export class ReservasLoginComponent implements OnInit {

  public comprobado: boolean = null;

  public login: FormGroup;

  public existe: any;

  public usuario: Usuario;

  constructor(public dialogRef: MatDialogRef<ReservasLoginComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private fb: FormBuilder, private http: HttpClient) {

    this.login = this.fb.group({
      email: ['', [Validators.required]],
      password: ['',  Validators.required],
    });

  }

  LogIn(){
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
  }

  ngOnInit() {
  }
}