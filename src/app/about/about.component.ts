import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private http: HttpClient) {
    this.http.get('http://localhost/servicios.php').subscribe(data => {
      console.log(data);
      }, error => console.log(error));
  }

  ngOnInit(): void {
  }

}
