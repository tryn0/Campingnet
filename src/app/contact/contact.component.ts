import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  public contacto: FormGroup;

  public caracteres: number = 255;

  constructor(public fb: FormBuilder) {
    this.contacto = this.fb.group({
      nombreCompleto: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[6-7][0-9]{8}$')]],
      //FALLA email
      //email: ['', [Validators.required, Validators.pattern("^(((\.)+)?[A-z0-9]+((\.)+)?)+@(((\.)+)?[A-z0-9]+((\.)+)?)+\.[A-z]+$")]],//Puede empezar por . o no, contener letras y numeros seguidos de punto o no, seguido por @ seguido por . o no letras y numeros y punto o no . letras
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)$")]],
      mensaje: ['',  [Validators.required, Validators.maxLength(255)]],
    });
  }

  changed() {
    this.caracteres = 255 - this.contacto.get('mensaje').value.length;
  }

  contactar(){
    console.log(this.contacto.value);
  }

  ngOnInit(): void {
  }

}
