import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Usuario } from '../usuario/usuario';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userdata: any;

  public login: FormGroup;

  public existe: any;

  public comprobado: string;

  public usuario: Usuario;


  constructor(private http: HttpClient, public fb: FormBuilder, private router: Router) {
    this.userdata = localStorage.getItem('usuarioActual');

    this.login = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.minLength(3), Validators.required]],
    });

  }

  //Función para mandar los datos introducidos (email y contraseña) al archivo login-usuario.php
  LogIn(){
    this.comprobado = 'null';
    let fd: any = new FormData();
    fd.append('email', this.login.get('email').value);
    fd.append('password', this.login.get('password').value);

    this.http.post<any>('http://localhost/login-usuario.php', fd).subscribe(data =>{
      //console.log(data);
      if(data != null){
        this.comprobado = 'true';
        this.existe = data[0];
        this.crearUsuario();
      }else{
        this.comprobado = 'false';
        //console.log('No se encuentra usuario o contraseña.')
      }
    }, error => console.log(error)
    );
  }

  crearUsuario(){
    if(this.existe != null){
      this.usuario = new Usuario(this.existe.EMAIL, this.existe.NIF_USUARIO, this.existe.NOMBRE_USUARIO, this.existe.PASSWD, this.existe.ROL, this.existe.TELEFONO);
      //console.log(this.usuario);
      localStorage.setItem('usuarioActual',JSON.stringify(this.usuario));
      this.router.navigate(['/login']);
      window.location.reload();
    }
  }

  ngOnInit(): void {
    if(this.userdata != null){
      this.router.navigate(['/']);
    }
  }

}
