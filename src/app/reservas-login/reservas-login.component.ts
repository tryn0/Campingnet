import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
  email: string;
}

@Component({
  selector: 'app-reservas-login',
  templateUrl: './reservas-login.component.html',
  styleUrls: ['./reservas-login.component.css']
})
export class ReservasLoginComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ReservasLoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }
}