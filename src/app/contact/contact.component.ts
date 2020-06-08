import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from "@angular/router";

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

  constructor(public fb: FormBuilder, private router: Router) {
    this.contacto = this.fb.group({
      nombreCompleto: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[6-7][0-9]{8}$')]],
      //FALLA PATRON del email
      //email: ['', [Validators.required, Validators.pattern("^(((\.)+)?[A-z0-9]+((\.)+)?)+@(((\.)+)?[A-z0-9]+((\.)+)?)+\.[A-z]+$")]],//Puede empezar por . o no, contener letras y numeros seguidos de punto o no, seguido por @ seguido por . o no letras y numeros y punto o no . letras
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

              setTimeout(()=>{ // Redireccion al cabo de 3segundo
                this.router.navigate(['/inicio']);
           }, 3000);
          
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
