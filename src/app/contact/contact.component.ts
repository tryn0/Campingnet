import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from "@angular/router";
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';

import { encriptar, desencriptar } from '../crypto-storage';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  public contacto: FormGroup;

  /* Cantidad de carácteres a mostrar */
  public caracteres: number = 255;

  /* Formulario de contacto validado, por defecto en null */
  public contactoVal: boolean = null;

  /* Variables de errores del formulario */
  public errorNombre: boolean = null;
  public errorTel: boolean = null;
  public errorEmail: boolean = null;
  public errorMensaje: boolean = null;

  public errorCorreo: boolean = false;

  constructor(public fb: FormBuilder, private router: Router, public http: HttpClient) {
    this.contacto = this.fb.group({
      nombreCompleto: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[6-7][0-9]{8}$')]],
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)$")]],
      mensaje: ['',  [Validators.required, Validators.maxLength(255)]],
    });
  }

  changed() {
    this.caracteres = 255 - this.contacto.get('mensaje').value.length;
  }

  volver(){
    history.back();
  }

  contactar(){
    if(!this.contacto.get('nombreCompleto').hasError('required')){ // Nombre escritos
      this.errorNombre = false;
      this.contactoVal = null;

      if(!this.contacto.get('telefono').hasError('required') && !this.contacto.get('telefono').hasError('pattern')){ // Telefono escrito
        this.errorTel = false;
        this.contactoVal = null;

        if(!this.contacto.get('email').hasError('required') && !this.contacto.get('email').hasError('pattern')){ // Email escrito
          this.errorEmail = false;
          this.contactoVal = null;

          if(!this.contacto.get('mensaje').hasError('required') && !this.contacto.get('mensaje').hasError('maxlength')){ // Mensaje escrito
            this.errorMensaje = false;
            this.contactoVal = null;

            if(this.contactoVal == null){
              // Aqui se manda el correo, todo correcto, FALTA POR ACABAR EL ENVIO DEL FORMULARIO POR CORREO O ALGO 
              console.log(this.contacto.value);
              this.contactoVal = true;

              let jsonReserva = {
                persona: {
                  email: this.contacto.value.email, 
                  nombre: this.contacto.value.nombreCompleto,
                  telefono: this.contacto.value.telefono
                },
                datos: {
                  mensaje: this.contacto.value.mensaje
                }
              };
  
              let jsonEncriptado = encriptar(JSON.stringify(jsonReserva));
              console.log(jsonEncriptado)
  
              const httpOptions = {
                headers: new HttpHeaders({
                  'Content-Type': 'application/x-www-form-urlencoded', 
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Headers': 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method',
                  'Access-Control-Allow-Methods': 'GET, POST',
                  'Allow': 'GET, POST'
                })
              };
  
              let datos = new HttpParams()
              .set('contacto', jsonEncriptado);
              this.http.post("http://us-central1-campingnet-pi.cloudfunctions.net/contacto", datos, httpOptions).subscribe(data => {
                console.log(data);
                if(data != '1') {
                  this.errorCorreo = true;
                  /*setTimeout(()=>{ // Redireccion al cabo de 3 segundos
                    this.router.navigate(['/inicio']);
                  }, 3000);*/
                }else{
                  /*setTimeout(()=>{ // Redireccion al cabo de 1 segundo y medio
                    this.router.navigate(['/inicio']);
                  }, 1500);*/
                }
              });          
            }
            
          }else{ // Error en el campo mensaje
            this.errorMensaje = true;
            this.contactoVal = false;
          }

        }else{ // Error en el campo email
          this.errorEmail = true;
          this.contactoVal = false;
        }

      }else{ // Error en el campo telefono
        this.errorTel = true;
        this.contactoVal = false;
      }

    }else{ // Error en el campo Nombre y apellidos
      this.errorNombre = true;
      this.contactoVal = false;
    }
  }

  ngOnInit(): void {
  }

}
