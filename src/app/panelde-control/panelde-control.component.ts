import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-panelde-control',
  templateUrl: './panelde-control.component.html',
  styleUrls: ['./panelde-control.component.css']
})
export class PaneldeControlComponent implements OnInit {

  public cp: FormGroup;

  public usuarioActual: any;

  constructor(public fb: FormBuilder) {

    this.usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    console.log(this.usuarioActual);

    this.cp = this.fb.group({
      email: ['', [Validators.required]],
      password: ['',  Validators.required],
    });

  }

  ngOnInit(): void {
  }

}
